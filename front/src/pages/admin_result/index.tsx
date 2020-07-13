import React from 'react';
import './admin_result.scss';
import { FoundationButton } from '../../components/FoundationButton';
import { QuizPanel } from '../../components/QuizPanel';

// FIXME: 仕様よう分かっとらんでな、あとで直す
type User = {
  name: string;
  starNumber: number;
  input: string;
};

export const AdminResult: React.FC = () => {
  const questionBody = '';
  const users: User[] = [];
  return (
    <div className="SubmitQuestion__view">
      <p>結果発表</p>
      <p className="Room__QuestionBox">{questionBody}</p>
      <FoundationButton
        label="次の問題へ"
        onClick={() => console.log('次の問題へ')}
      />
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
