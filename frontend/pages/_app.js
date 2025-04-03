// pages/_app.js
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import dynamic from 'next/dynamic';
import createEmotionCache from '../createEmotionCache';
import theme from '../theme';
import GlobalStyles from '../styles/GlobalStyles';
import Layout from '../components/Layout';
import { PlayerProvider } from '../context/PlayerContext';
import AuthProvider from '../context/AuthContext'; // ✅ Import your AuthProvider

const PersistentPlayer = dynamic(() => import('../components/Player'), { ssr: false });

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Karrma&apos;s Heart</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <AuthProvider> {/* ✅ Wrap app in AuthProvider */}
          <PlayerProvider>
            <Layout>
              <Component {...pageProps} />
              <PersistentPlayer />
            </Layout>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
