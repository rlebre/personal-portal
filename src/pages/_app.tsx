import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import '../assets/styles/globals.scss';
import Layout from '../components/layout';
import Academic from './academic';
import Hobbies from './hobbies';
import Professional from './professional';

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
        <link rel='icon' href='/logo.svg' />
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
