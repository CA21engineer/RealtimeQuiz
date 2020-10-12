import React, { useCallback, useContext, useRef } from 'react';
import { setTimeLimitNumber, setEnableTimeLimit } from 'acitons/gameStatus';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanelContainer } from 'container/QuizPanelContainer';

import './adminSubmitQuestion.scss';

export const AdminSubmitQuestion: React.FC = () => {
  const questionRef = useRef<HTMLInputElement>(null);
  const setTimeLimitRef = useRef<HTMLInputElement>(null);
  const timeLimitRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const { state, dispatch } = useContext(GameStatusContext);
  const { controllers, personalStatus } = state;
  const { isTimelimitChecked, timelimit } = personalStatus;

  const submitQuestion = useCallback(() => {
    const question = questionRef.current?.value;
    const setTimeLimit = setTimeLimitRef.current?.checked;
    const timeLimit = setTimeLimit ? Number(timeLimitRef.current?.value) : null;
    const correctAnswer = answerRef.current?.value;

    if (!question || !controllers.emitter) {
      return;
    }

    controllers.emitter.setQuestion(question, timeLimit, correctAnswer);
  }, [state, questionRef, answerRef]);

  const handleChangeIsTimelimitChecked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      dispatch(setEnableTimeLimit(checked));
    },
    [dispatch]
  );

  const handleChangeTimelimit = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (Number.isNaN(value)) {
        return;
      }

      dispatch(setTimeLimitNumber(value));
    },
    [dispatch]
  );

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
              defaultChecked={isTimelimitChecked}
              onChange={handleChangeIsTimelimitChecked}
              ref={setTimeLimitRef}
            />
            時間制限をする
          </label>
          <input
            className="Room__timeLimitInput"
            type="number"
            defaultValue={timelimit}
            onChange={handleChangeTimelimit}
            ref={timeLimitRef}
          />
          秒
        </div>
        <input className="Room__QuestionBox" type="text" ref={questionRef} placeholder="問題" />
        <input className="Room__QuestionBox" type="text" ref={answerRef} placeholder="答え(任意)" />
        <FoundationButton label="出題する" onClick={submitQuestion} />
      </div>
      <QuizPanelContainer roleType="admin" />
    </div>
  );
};
