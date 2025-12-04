import Head from 'next/head';
import F1Globe from '../components/f1_globe';

export default function Home() {
  return (
    <>
      <Head>
        <title>F1 Globe</title>
        <meta name="description" content="Interactive dashboard with globe map" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <F1Globe />
      </main>
    </>
  );
}