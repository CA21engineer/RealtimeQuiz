import React from 'react';
import './roomCard.scss';
import { FoundationButton } from '../FoundationButton/FoundationButton';

type Props = {
  title: string;
  roomInfo: string;
};

export const RoomCard: React.FC<Props> = ({ title, roomInfo }) => {
  return (
    <div className="Room__container">
      <p className="Room__Title">{title}</p>
      <p className="Room__RoomInfo">{roomInfo}</p>
      <FoundationButton
        onClick={() => {
          console.log('Hello');
        }}
        label="入室する"
      />
    </div>
  );
};
