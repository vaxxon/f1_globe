// pages/_app.js
import '../styles/globals.css';
import { Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap'
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${publicSans.variable} font-sans`}>
    <Component {...pageProps} />
    </div>
  );
}