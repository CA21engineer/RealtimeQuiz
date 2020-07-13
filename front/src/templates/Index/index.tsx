import React from 'react';
import './index.scss';

import { FoundationInputArea } from '../../components/FoundationInputArea';

type Room = {
  id: string;
  title: string;
  roomInfo: string;
};

export const Index: React.FC = () => {
  const rooms: Room[] = [];
  return (
    <div className="Index__view">
      <h1 className="Index__Title">RealTime Quiz!</h1>
      <p className="Index__Description">新しく部屋を作る</p>
      <FoundationInputArea
        inputBody=""
        onInputAnswer={(inputName: string) => console.log(inputName)}
        onClickSubmitButton={() => {
          console.log('Send server');
        }}
        inputPlaceholder="部屋名を入力"
        submitLabel="部屋を作る"
      />
      {rooms.map((room) => {
        return (
          <div key={room.id} className="Room__container">
            <p className="Room__Title">{room.title}</p>
            <p className="Room__RoomInfo">{room.roomInfo}</p>
            <button
              type="button"
              onClick={() => {
                console.log('Hello');
              }}
            >
              入室する
            </button>
          </div>
        );
      })}
    </div>
  );
};
