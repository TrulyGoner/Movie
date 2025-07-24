import type { AppProps } from 'next/app';
import ReduxProvider from '../components/Provider';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}