import React from 'react';
import './quizAdminPanel.scss';
import { QuizPanel } from '../QuizPanel';

type Props = {
  name: string;
  starsNumber: number;
  alterStarsNumber: number;
  answerText: string;
  isOnline: boolean;
  emitAlterStar: (star: number) => void;
};

export const QuizAdminPanel: React.FC<Props> = ({
  name,
  starsNumber,
  alterStarsNumber,
  answerText,
  isOnline,
  emitAlterStar,
}) => {
  return (
    <div className="QuizAdminPanel__Container">
      <QuizPanel
        name={name}
        starNumber={starsNumber + alterStarsNumber}
        answerText={answerText}
        isOnline={isOnline}
      />
      <div className="QuizAdminPanel__StarPanel">
        <div className="QuizAdminPanel__StarController">
          <button
            className="QuizAdminPanel__StarButton"
            onClick={() => emitAlterStar(-1)}
            type="button"
          >
            {`⭐️ - ${1}`}
          </button>
          <span className="QuizAdminPanel__AlterStars">{alterStarsNumber}</span>
          <button
            className="QuizAdminPanel__StarButton"
            onClick={() => emitAlterStar(1)}
            type="button"
          >
            {`⭐️ + ${1}`}
          </button>
        </div>
      </div>
    </div>
  );
};
