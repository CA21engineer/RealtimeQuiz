import React from 'react';
import classNames from 'classnames';
import './quizPanel.scss';

export enum PlusMinus {
  'Plus' = 'Plus',
  'Minus' = 'Minus',
  'None' = 'None',
}

type Props = {
  name: string;
  starNumber: number;
  answerText: string;
  plusMinus?: keyof typeof PlusMinus;
  isOnline: boolean;
};

export const QuizPanel: React.FC<Props> = ({
  name,
  starNumber,
  answerText,
  plusMinus = PlusMinus.None,
  isOnline,
}) => {
  const getStarText = (star: number) => {
    const STAR_LIMIT = 5;
    if (star === 0 || Number.isNaN(star)) {
      return '⭐️ * 0';
    }

    if (star < 0) {
      return `⭐️ - ${star * -1}`;
    }

    if (star > STAR_LIMIT) {
      return `⭐️ + ${star}`;
    }

    return [...Array(star)].reduce((acc: string) => {
      return `${acc}⭐️`;
    }, '');
  };

  const starText = getStarText(starNumber);
  if (!isOnline) {
    // eslint-disable-next-line no-param-reassign
    name += '(オフライン)';
  }

  return (
    <div
      className={classNames({
        QuizPanel__Container: true,
        'QuizPanel__Container--Plus': PlusMinus.Plus === plusMinus,
        'QuizPanel__Container--Minus': PlusMinus.Minus === plusMinus,
      })}
    >
      <div className="QuizPanel__Header">
        <p className="QuizPanel__NameArea">{name}</p>
        <span className="QuizPanel__StarArea">{starText}</span>
      </div>
      <p className="QuizPanel__AnswerArea">{answerText}</p>
    </div>
  );
};
