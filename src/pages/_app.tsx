import '../assets/styles/globals.scss';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import Academic from './academic';
import Professional from './professional';
import Hobbies from './hobbies';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  let withLayout = false;
  switch (Component) {
    case Academic:
    case Professional:
    case Hobbies:
      withLayout = true;
      break;
  }

  return (
    <>
      <Head>
        <meta name='ruilebre.com' content='Personal website of Rui Lebre - software engineer.' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Rui Lebre</title>
      </Head>
      <>
        {withLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </>
    </>
  );
}

export default MyApp;
