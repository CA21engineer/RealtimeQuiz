import React, { useCallback, useContext, useRef } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanelContainer } from 'container/QuizPanelContainer';

import './adminSubmitQuestion.scss';

export const AdminSubmitQuestion: React.FC = () => {
  const questionRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(GameStatusContext);
  const { controllers } = state;

  const submitQuestion = useCallback(() => {
    const question = questionRef.current?.value;
    if (!question || !controllers.emitter) {
      return;
    }

    controllers.emitter.setQuestion(question);
  }, [state, questionRef]);

  return (
    <div className="SubmitQuestion__view">
      <p>出題を待っています…</p>
      <div className="SubmitQuestion__InputQuestion">
        <h1>問題を出題してください</h1>
        <input className="Room__QuestionBox" type="text" ref={questionRef} />
        <FoundationButton label="出題する" onClick={submitQuestion} />
      </div>
      <QuizPanelContainer roleType="admin" highlight />
    </div>
  );
};
