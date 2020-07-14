import React from 'react';
import './admin_room.scss';
import { FoundationButton } from '../../components/FoundationButton';
import { QuizAdminPanel } from '../../components/QuizAdminPanel';

// FIXME: 仕様よう分かっとらんでな、あとで直す
type User = {
  name: string;
  starNumber: number;
  input: string;
};

type UserStatus = {
  user: User;
  givenStar: number;
};

export const AdminRoom: React.FC = () => {
  const questionBody = '';
  const userStatusArray: UserStatus[] = [];
  const remainTime = 0;
  return (
    <div className="AdminRoom__view">
      <p>{`制限時間残り${remainTime}秒`}</p>
      <div>
        <h1>問題を出題しています</h1>
        <input className="AdminRoom__QuestionBox" value={questionBody} />
        <FoundationButton
          label="解答を締め切る"
          onClick={() => console.log('解答を締め切る')}
        />
        <FoundationButton
          label="一斉にオープン"
          onClick={() => console.log('一斉にオープン')}
        />
        <FoundationButton
          label="結果発表"
          onClick={() => console.log('結果発表')}
        />
      </div>
      {userStatusArray.map((userStatus) => (
        <QuizAdminPanel
          key={userStatus.user.name}
          name={userStatus.user.name}
          starNumber={userStatus.user.starNumber}
          answerText={userStatus.user.input}
          givenStar={userStatus.givenStar}
          setValue={(starNumber: number) => console.log(starNumber)}
        />
      ))}
    </div>
  );
};
