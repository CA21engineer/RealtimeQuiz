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
    <div className="AdminResult__View">
      <p className="Admin__Status">結果発表</p>
      <div className="AdminResult__Question">
        {currentQuestion && (
          <p className="AdminRoom__QuestionBox">{currentQuestion}</p>
        )}
        <FoundationButton label="次の問題へ" onClick={emitGoToNextQuestion} />
      </div>
      <QuizPanelContainer roleType="admin" />
    </div>
  );
};
