import React from 'react';
import './submit_question.scss';
import { FoundationButton } from '../../components/FoundationButton';
import { QuizPanel } from '../../components/QuizPanel';

// FIXME: 仕様よう分かっとらんでな、あとで直す
type User = {
  name: string;
  starNumber: number;
  input: string;
};

export const SubmitQuestion: React.FC = () => {
  const questionBody = '';
  const users: User[] = [];
  return (
    <div className="SubmitQuestion__view">
      <p>出題を待っています…</p>
      <div>
        <h1>問題を出題しています</h1>
        <input className="Room__QuestionBox" value={questionBody} />
        <FoundationButton
          label="出題する"
          onClick={() => console.log('出題する')}
        />
      </div>
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
