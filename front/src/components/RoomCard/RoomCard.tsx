import React from 'react';
import './roomCard.scss';
import { FoundationButton } from '../FoundationButton/FoundationButton';

type Props = {
  title: string;
  roomInfo: string;
  onEnterRoom: (() => void) | (() => Promise<void>);
};

export const RoomCard: React.FC<Props> = ({ title, roomInfo, onEnterRoom }) => {
  return (
    <div className="Room__container">
      <p className="Room__Title">{title}</p>
      <p className="Room__RoomInfo">{roomInfo}</p>
      <FoundationButton onClick={onEnterRoom} label="入室する" />
    </div>
  );
};
