import React from 'react';
import classNames from 'classnames';
import './quizPanel.scss';
import { logger } from '../../utils/log';

const STAR_NUMBER_MAX = 5;
const STAR_NUMBER_MIN = 0;

export enum PlusMinus {
  'Plus',
  'Minus',
  'None',
}

type Props = {
  name: string;
  starNumber: number;
  answerText: string;
  plusMinus?: PlusMinus;
};

export const QuizPanel: React.FC<Props> = ({
  name,
  starNumber,
  answerText,
  plusMinus = PlusMinus.None,
}) => {
  if (
    Number.isNaN(starNumber) ||
    starNumber < STAR_NUMBER_MIN ||
    starNumber > STAR_NUMBER_MAX
  ) {
    logger(`Fatal: Start number is unexpected. Given ${starNumber}.`);
  }
  // HELP ME: 急募，なんかいい書き方
  const getStarText = (star: number) => {
    const STAR_LIMIT = 5;
    if (star === 0) {
      return '⭐️ * 0';
    }

    if (star < 0) {
      return `⭐️ ${star}`;
    }

    if (star > STAR_LIMIT) {
      return `⭐️ + ${star}`;
    }

    return [...Array(star)].reduce((acc: string) => {
      return `${acc}⭐️`;
    }, '');
  };

  const starText = getStarText(starNumber);

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
