import React from 'react';
import './room_entrance.scss';

import { FoundationInputArea } from '../../components/FoundationInputArea';

const RoomEntrance: React.FC = () => {
  return (
    <div className="Room__view">
      <p className="Room__label">ニックネームを入力してください．</p>
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

export default RoomEntrance;
