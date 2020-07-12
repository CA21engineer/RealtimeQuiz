import React from 'react';
import './quizPanel.scss';
import { logger } from '../../utils/log';

const STAR_NUMBER_MAX = 5;
const STAR_NUMBER_MIN = 0;

type Props = {
  name: string;
  starNumber: number;
  answerText: string;
};

export const QuizPanel: React.FC<Props> = ({
  name,
  starNumber,
  answerText,
}) => {
  if (
    Number.isNaN(starNumber) ||
    starNumber < STAR_NUMBER_MIN ||
    starNumber > STAR_NUMBER_MAX
  ) {
    logger(`Fatal: Start number is unexpected. Given ${starNumber}.`);
  }
  // HELP ME: 急募，なんかいい書き方
  let starText = '';
  for (let i = 0; i < starNumber; i += 1) {
    starText += '⭐️';
  }
  return (
    <div className="QuizPanel__Container">
      <div className="QuizPanel__Header">
        <p className="QuizPanel__NameArea">{name}</p>
        <span className="QuizPanel__StarArea">{starText}</span>
      </div>
      <p className="QuizPanel__AnswerArea">{answerText}</p>
    </div>
  );
};
