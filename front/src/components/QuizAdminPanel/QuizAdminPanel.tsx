import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { getPlusMinus } from 'utils/getPlusMinus';
import { QuizPanel } from '../QuizPanel';

import './quizAdminPanel.scss';

type Props = {
  name: string;
  starsNumber: number;
  alterStarsNumber: number;
  answerText: string;
  isOnline: boolean;
  isAnswered: boolean;
  changeColor: boolean;
  emitAlterStar: (star: number) => void;
};

export const QuizAdminPanel: React.FC<Props> = ({
  name,
  starsNumber,
  alterStarsNumber,
  answerText,
  isOnline,
  isAnswered,
  changeColor,
  emitAlterStar,
}) => {
  const INIT_STAR_NUMBER = 1;
  const [givinStars, setGivinStars] = useState(INIT_STAR_NUMBER);
  const plusMinus = changeColor && getPlusMinus(alterStarsNumber) ;
  const emitAlterStarWithNumber = useCallback(
    (num: number) => {
      emitAlterStar(alterStarsNumber + num);
    },
    [emitAlterStar, givinStars, setGivinStars]
  );

  return (
    <div
      className={cx('QuizAdminPanel__Container', {
        'QuizAdminPanel__Container--Plus': plusMinus === 'Plus',
        'QuizAdminPanel__Container--Minus': plusMinus === 'Minus',
        disabled: !isAnswered,
      })}
    >
      <QuizPanel
        name={name}
        starNumber={starsNumber}
        answerText={answerText}
        plusMinus={plusMinus}
        isOnline={isOnline}
      />
      <div className="QuizAdminPanel__StarPanel">
        <div className="QuizAdminPanel__StarController">
          <button
            className="QuizAdminPanel__StarButton"
            onClick={() => emitAlterStarWithNumber(-1)}
            type="button"
          >
            {`⭐️ - ${givinStars}`}
          </button>
          <p className="QuizAdminPanel__InputStar">{alterStarsNumber}</p>
          <button
            className="QuizAdminPanel__StarButton"
            onClick={() => emitAlterStarWithNumber(1)}
            type="button"
          >
            {`⭐️ + ${givinStars}`}
          </button>
        </div>
      </div>
    </div>
  );
};
