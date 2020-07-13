import React from 'react';
import './index.scss';

import { FoundationInputArea } from '../../components/FoundationInputArea';

const Index: React.FC = () => {
  return (
    <div className="Index__view">
      <p className="Index__label">ニックネームを入力してください．</p>
      <FoundationInputArea
        inputBody=""
        onInputAnswer={(inputName: string) => console.log(inputName)}
        onClickSubmitButton={() => {
          console.log('Send server');
        }}
        inputPlaceholder="ニックネーム"
        submitLabel="入室"
      />
    </div>
  );
};

export default Index;
