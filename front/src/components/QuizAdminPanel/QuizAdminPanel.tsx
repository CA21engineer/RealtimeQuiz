import React from 'react';
import './quizAdminPanel.scss';
import { QuizPanel } from '../QuizPanel';

type Props = {
  name: string;
  starNumber: number;
  answerText: string;
  starsRef?: React.Ref<HTMLInputElement>;
};

export const QuizAdminPanel: React.FC<Props> = ({
  name,
  starNumber,
  answerText,
  starsRef,
}) => {
  const [givenStar, setGivenStar] = React.useState(0);
  return (
    <div className="QuizAdminPanel__Container">
      <QuizPanel name={name} starNumber={starNumber} answerText={answerText} />
      <div className="QuizAdminPanel__StarPanel">
        <button
          className="QuizAdminPanel__StarButton"
          onClick={() => setGivenStar((s) => s - 1)}
          type="button"
        >
          {`⭐️-${1}`}
        </button>
        <input
          className="QuizAdminPanel__InputStar"
          type="number"
          value={givenStar}
          onChange={(e) => {
            setGivenStar(e.target.valueAsNumber);
          }}
          ref={starsRef}
        />
        <button
          className="QuizAdminPanel__StarButton"
          onClick={() => setGivenStar((s) => s + 1)}
          type="button"
        >
          {`⭐️+${1}`}
        </button>
      </div>
    </div>
  );
};
