import React from 'react';
import './room.scss';

import { ViewStatus } from '../../types/ViewStatus';
import { QuizPanel } from '../../components/QuizPanel';
import { expressRoomStatus } from './expressRoomStatus';
import { QuestionModal } from '../../components/QuestionModal';

// FIXME: 仕様よう分かっとらんでな、あとで直す
type User = {
  name: string;
  starNumber: number;
  input: string;
};

const Room: React.FC = () => {
  const status: ViewStatus = ViewStatus.WAITING_QUESTION as ViewStatus;
  const users: User[] = [];
  const questionBody = '';
  const answerBody = '';
  const isAnswerFinished = false;
  const onInputAnswer: (input: string) => void = (input) => console.log(input);
  const onSubmitAnswer: React.MouseEventHandler = (e) => console.log(e);

  return (
    <div className="Room__view">
      {status === ViewStatus.WAITING_ANSWER && !isAnswerFinished ? (
        <QuestionModal
          questionBody={questionBody}
          remainTime={0}
          answerBody={answerBody}
          onInputAnswer={onInputAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      ) : null}
      <p>{expressRoomStatus(status)}</p>
      {questionBody !== '' ? (
        <p className="Room__QuestionBox">{questionBody}</p>
      ) : null}
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
