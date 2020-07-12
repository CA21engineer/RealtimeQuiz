import React from 'react';
import './room.scss';

import { ViewStatus } from '../../types/ViewStatus';
import { QuizPanel } from '../../components/QuizPanel';
import { expressRoomStatus } from './expressRoomStatus';

// FIXME: 仕様よう分かっとらんでな、あとで直す
type User = {
  name: string;
  starNumber: number;
  input: string;
};

const Room: React.FC = () => {
  const status: ViewStatus = ViewStatus.WAITING_QUESTION;
  const users: User[] = [];
  return (
    <div className="Room__view">
      <p>{expressRoomStatus(status)}</p>
      {users.map((user) => (
        <QuizPanel
          key={user.name}
          name={user.name}
          starNumber={user.starNumber}
          answerText={user.input}
        />
      ))}
    </div>
  );
};

export default Room;
