import React, { useCallback, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanelContainer } from 'container/QuizPanelContainer';

import './adminResult.scss';

export const AdminResult: React.FC = () => {
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { currentQuestion } = roomStatus;

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
      <QuizPanelContainer roleType="admin" />
    </div>
  );
};
