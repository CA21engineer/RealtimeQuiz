import React, { useCallback, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanel } from 'components/QuizPanel';

import './adminResult.scss';

export const AdminResult: React.FC = () => {
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { players, currentQuestion } = roomStatus;

  const emitGoToNextQuestion = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.goToNextQuestion();
  }, [controllers]);

  return (
    <div className="SubmitQuestion__view">
      <p>結果発表</p>
      {currentQuestion && (
        <input className="AdminRoom__QuestionBox" value={currentQuestion} />
      )}
      <FoundationButton label="次の問題へ" onClick={emitGoToNextQuestion} />
      {players.map((player) => {
        const answer = player.isAnswered ? '解答中...' : player.answer || '';
        return (
          <QuizPanel
            key={player.id}
            name={player.name}
            starNumber={player.stars}
            answerText={answer}
          />
        );
      })}
    </div>
  );
};
