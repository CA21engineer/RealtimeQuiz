import React, { useCallback, useContext, useRef } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanelContainer } from 'container/QuizPanelContainer';

import './adminSubmitQuestion.scss';

export const AdminSubmitQuestion: React.FC = () => {
  const questionRef = useRef<HTMLInputElement>(null);
  const setTimeLimitRef = useRef<HTMLInputElement>(null);
  const timeLimitRef = useRef<HTMLInputElement>(null);

  const { state } = useContext(GameStatusContext);
  const { controllers } = state;

  const submitQuestion = useCallback(() => {
    const question = questionRef.current?.value;
    const setTimeLimit = setTimeLimitRef.current?.checked;
    const timeLimit = setTimeLimit ? Number(timeLimitRef.current?.value) : null;

    if (!question || !controllers.emitter) {
      return;
    }

    controllers.emitter.setQuestion(question, timeLimit);
  }, [state, questionRef]);

  return (
    <div className="SubmitQuestion__view">
      <p>出題を待っています…</p>
      <div className="SubmitQuestion__InputQuestion">
        <h1>問題を出題してください</h1>

        <div className="Room__timeLimit">
          <label className="Room__setTimeLimitLabel">
            <input
              className="Room__setTimeLimit"
              type="checkbox"
              ref={setTimeLimitRef}
            />
            時間制限をする
          </label>
          <input
            className="Room__timeLimitInput"
            type="number"
            ref={timeLimitRef}
          />
          秒
        </div>
        <input className="Room__QuestionBox" type="text" ref={questionRef} />
        <FoundationButton label="出題する" onClick={submitQuestion} />
      </div>
      <QuizPanelContainer roleType="admin" />
    </div>
  );
};
