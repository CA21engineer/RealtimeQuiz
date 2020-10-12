import React, { useCallback, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanelContainer } from 'container/QuizPanelContainer';

import './adminResult.scss';
import { QuestionContent } from "components/QuestionContent";

export const AdminResult: React.FC = () => {
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { currentQuestion, currentCorrectAnswer } = roomStatus;

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
        <div className="AdminResult__TextLabel">
          問題
        </div>
        {currentQuestion && <QuestionContent content={currentQuestion} />}
        {currentCorrectAnswer && (
          <>
            <div className="AdminResult__TextLabel">
              答え
            </div>
            <QuestionContent content={currentCorrectAnswer} />
          </>
        )}
        <FoundationButton label="次の問題へ" onClick={emitGoToNextQuestion} />
      </div>
      <QuizPanelContainer roleType="admin" highlight />
    </div>
  );
};
