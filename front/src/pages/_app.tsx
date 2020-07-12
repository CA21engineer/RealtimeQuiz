import React from 'react';
import { AppProps } from 'next/app';
import { Store } from 'store';

import 'style/global.scss';

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Store>
      <main>
        <Component {...pageProps} />
      </main>
    </Store>
  );
}

export default App;
