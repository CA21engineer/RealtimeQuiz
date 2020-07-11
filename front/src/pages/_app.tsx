import React from 'react';
import { AppProps } from 'next/app';

import '../style/global.scss';

function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}

export default App;
