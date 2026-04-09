# F1 Globe 2025

A map of all the tracks used in the 2025 season along with weather data from that weekend from the beginning of F1 in 1950 to 2025.

This project was built for INFO-609 Intro to GIS at Pratt Institute’s School of Information. You can see it in action at [my website](http://vincentallport.com/f1_globe). This repo consists of:

- [f1_globe.ipynb](f1_globe.ipynb), a Jupyter notebook, and
- [f1_globe/](f1_globe), a Next.js app that powers the [interactive globe](http://vincentallport.com/f1_globe).

## Methodology

- I sourced the race schedule for the 2025 Formula 1 season using the [FastF1 API](https://docs.fastf1.dev).
- I extracted the month, day, and hour of each 2025 race from that schedule and fetched weather conditions in each place, date, and time from 1950 (the first year of F1) to 2024 using [Open-Meteo’s historical weather API](https://open-meteo.com/en/docs/historical-weather-api). 
- This data was visualized using [pandas](https://pandas.pydata.org) and [matplotlib](https://matplotlib.org).
- The interactive globe was built using [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/), [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

## Project roadmap

- Add weather forecasting to each track.
- Add higher resolution graphs for weather (All time, since 2020, next season, etc.)
- Add predictions for future races based on forecasted weather conditions and driver history.
- Add animations for each type of weather.