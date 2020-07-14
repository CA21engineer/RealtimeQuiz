import React from 'react';
import './quizAdminPanel.scss';
import { QuizPanel } from '../QuizPanel';

type Props = {
  name: string;
  starNumber: number;
  answerText: string;
  givenStar: number;
  setValue: (starNumber: number) => void;
};

export const QuizAdminPanel: React.FC<Props> = ({
  name,
  starNumber,
  answerText,
  setValue,
}) => {
  const [givenStar, setGivenStar] = React.useState(1);
  return (
    <div className="QuizAdminPanel__Container">
      <QuizPanel name={name} starNumber={starNumber} answerText={answerText} />
      <div className="QuizAdminPanel__StarPanel">
        <button
          className="QuizAdminPanel__StarButton"
          onClick={() => setValue(givenStar)}
          type="button"
        >
          {`⭐️-${givenStar}`}
        </button>
        <input
          className="QuizAdminPanel__InputStar"
          type="number"
          value={givenStar}
          onChange={(e) => {
            setGivenStar(e.target.valueAsNumber);
          }}
        />
        <button
          className="QuizAdminPanel__StarButton"
          onClick={() => setValue(givenStar)}
          type="button"
        >
          {`⭐️+${givenStar}`}
        </button>
      </div>
    </div>
  );
};
