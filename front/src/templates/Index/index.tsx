import React from 'react';
import './index.scss';

import { FoundationInputArea } from '../../components/FoundationInputArea';
import { RoomCard } from '../../components/RoomCard';

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
          <RoomCard key={room.id} title={room.title} roomInfo={room.roomInfo} />
        );
      })}
    </div>
  );
};
