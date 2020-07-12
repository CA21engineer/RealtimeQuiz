import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { FoundationInputArea } from '../components/FoundationInputArea';

storiesOf('FoundationInputArea', module).add('Width 640px', () => {
  return (
    <div style={{ width: '640px' }}>
      <FoundationInputArea
        inputBody=""
        onInputAnswer={() => {
          console.log('None of arguments.');
        }}
        onClickSubmitButton={() => {
          console.log('None of arguments');
        }}
        inputPlaceholder="プレースホルダーってUXからするとなんかバッドノウハウらしいわね"
        submitLabel="送信"
      />
    </div>
  );
});
