import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';``
import 'mapbox-gl/dist/mapbox-gl.css';
import DescriptionSection from './DescriptionSection';

// default public token – change to restricted at some point
mapboxgl.accessToken = 'pk.eyJ1IjoidmluY2VudGFsbHBvcnQiLCJhIjoiY202aDBvd291MDZxbjJpcGw0aDdwaWpzYiJ9.4NQYm63L_H2zVqh4W2elPA';

const basePath = '/f1_globe'
function nameToFile(name) { // strip uppercase, spaces, and accent chars from city strings
  return name
  .toLowerCase()
  .normalize("NFD") // decompose single accented letter into letter + combining accent char
  .replace(/[\u0300-\u036f]/g, "") // remove combining accent chars
  .replace(/[-\s]+/g, "_") // replace spaces with underscores
}

export default function F1Globe() { // page component
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (map.current) return; // don't recreate map if exists

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // make my own?
      center: [15, 40], // over europe
      zoom: 1.5,
      projection: 'globe',
    });

    map.current.on('load', () => {
      fetch('tracks.geojson') // fetching from root... fix when you add dates & track names
        .then((res) => res.json())
        .then((data) => {
          setGeojsonData(data);

          map.current.addSource('tracks', {
            type: 'geojson',
            data: data,
          });
          
          // persistent points layer
          map.current.addLayer({
            id: 'track-points',
            type: 'circle',
            source: 'tracks',
            paint: {
              'circle-radius': 6,
              'circle-color': '#C8102E',
            },
          });

          // pulsing dot 
          const size = 100;
          const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function () {
              const canvas = document.createElement('canvas');
              canvas.width = this.width;
              canvas.height = this.height;
              this.context = canvas.getContext('2d');
            },

            render: function () {
              const duration = 1000;
              const t = (performance.now() % duration) / duration; // t = animation time to fade

              const radius = (size / 2) * 0.3;
              const outerRadius = (size / 2) * 0.7 * t + radius;
              const context = this.context;

              context.clearRect(0, 0, this.width, this.height);

              // pulsing dot
              context.beginPath();
              context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
              );
              context.fillStyle = `rgba(200, 16, 46, ${1 - t})`; 
              context.fill();

              // persistent track dot
              context.beginPath();
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
              context.fillStyle = 'rgba(200, 16, 46, 1)';
              context.fill();

              this.data = context.getImageData(0, 0, this.width, this.height).data;

              map.current.triggerRepaint(); // trigger animation
              return true;
            }

          };
          // propagate image
          map.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

          // will add to and delete from feature collection onclick
          map.current.addSource('selected-track', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          map.current.addLayer({
            id: 'track-points-selected',
            type: 'symbol',
            source: 'selected-track',
            layout: {
              'icon-image': 'pulsing-dot',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            },
          });

          map.current.on('click', 'track-points', (e) => {
            const feature = e.features[0];
            setSelectedFeature(feature);

            const selectedSource = map.current.getSource('selected-track');
            if (selectedSource) {
              selectedSource.setData({
                type: 'FeatureCollection',
                features: [feature],
              });
            }
          });

          map.current.on('mouseenter', 'track-points', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', 'track-points', () => {
            map.current.getCanvas().style.cursor = '';
          });
        });
    });
  }, []);

  return ( // draw page
    <div className="flex h-screen w-screen">
      <div ref={mapContainer} className="w-1/2 h-full" />
      <div className="w-1/2 h-full p-6 overflow-auto bg-gray-50 info">
        {selectedFeature ? (
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {selectedFeature.properties.CourseName}
              <img
                src={`${basePath}/flags/${nameToFile(selectedFeature.properties.Country)}.svg`}
                alt={`Flag of ${selectedFeature.properties.Country}`}
                className="h-8 float-right ml-4"
              />
            </h1>
            <p>
              <strong>{selectedFeature.properties.Location}, {selectedFeature.properties.Country}</strong>{'  •  '}
              {selectedFeature.properties.month} {selectedFeature.properties.day} at {selectedFeature.properties.hour}{'  •  '}
              <strong>Latitude</strong>{' '}
              {selectedFeature.geometry.coordinates[1].toFixed(4)}{'  •  '}
              <strong>Longitude</strong>{' '}
              {selectedFeature.geometry.coordinates[0].toFixed(4)}
            </p>

            <div className="mt-4">
              <div className="flex space-x-2 mb-2">
                {['Temperature',
                  'Humidity',
                  'Pressure',
                  'Rain',
                  'Wind Speed',
                ].map((label, index) => (
                  <button
                    key={index}
                    className={`flex-1 px-4 py-2 text-m font-medium text-center rounded ${
                      selectedTab === index
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => setSelectedTab(index)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="border p-4 rounded bg-white shadow">
                {selectedTab === 0 && ( // temperature
                  <>
                    <img src={`${basePath}/charts/${nameToFile(selectedFeature.properties.Location)}_temperature_2m_race_hour.svg`} />
                    <DescriptionSection mdPath={`${basePath}/descriptions/temperature_2m.md`} />
                  </>
                )}
                {selectedTab === 1 && ( // humidity
                  <>
                    <img src={`${basePath}/charts/${nameToFile(selectedFeature.properties.Location)}_relative_humidity_2m_race_hour.svg`} />
                    <DescriptionSection mdPath={`${basePath}/descriptions/relative_humidity_2m.md`} />
                  </>
                )}
                {selectedTab === 2 && ( // barometric pressure
                  <>
                    <img src={`${basePath}/charts/${nameToFile(selectedFeature.properties.Location)}_pressure_msl_race_hour.svg`} />
                    <DescriptionSection mdPath={`${basePath}/descriptions/pressure_msl.md`} />
                  </>
                )}
                {selectedTab === 3 && ( // precipitation – switch name to rain? change graph to rain too
                  <>
                    <img src={`${basePath}/charts/${nameToFile(selectedFeature.properties.Location)}_precipitation_race_hour.svg`} />
                    <DescriptionSection mdPath={`${basePath}/descriptions/precipitation.md`} />
                  </>
                )}
                {selectedTab === 4 && ( // wind speed
                  <>
                    <img src={`${basePath}/charts/${nameToFile(selectedFeature.properties.Location)}_wind_speed_10m_race_hour.svg`} />
                    <DescriptionSection mdPath={`${basePath}/descriptions/wind_speed_10m.md`} />
                  </>
                )}
              </div>
              <div className='infoDiv'>
                <p className='info'>Sources: <a href='https://www.redbull.com/int-en/how-weather-impacts-f1-racing'>Red Bull (weather)</a>, <a href='https://www.redbull.com/au-en/f1-technique-wind-on-car-aerodynamics'>Red Bull (wind speed)</a>, and <a href='https://motorsportengineer.net/how-weather-conditions-influence-performance-in-formula-1/'>Motorsport Engineer</a>.</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Welcome to the F1 Weather Trend Map.</strong> This map displays weather status at each 2025 F1 season track for the past 75 years at the date and time of the 2025 race, and explains how prevailing trends in weather may affect race strategy.</p>
            <br />
            <p><strong>Select a track to begin.</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}