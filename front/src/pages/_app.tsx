import React from 'react';
import ReactModal from 'react-modal';
import { AppProps } from 'next/app';
import { Store } from 'store';

import 'style/global.scss';

ReactModal.setAppElement('#__next');

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
