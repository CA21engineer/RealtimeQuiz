import React, { useCallback, useContext, useRef } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizPanel } from 'components/QuizPanel';

import './adminSubmitQuestion.scss';

export const AdminSubmitQuestion: React.FC = () => {
  const questionRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { players } = roomStatus;

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
      <div>
        <h1>問題を出題しています</h1>
        <input className="Room__QuestionBox" type="text" ref={questionRef} />
        <FoundationButton label="出題する" onClick={submitQuestion} />
      </div>

      {players
        .filter(({ role }) => role === 'player')
        .map((player) => {
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
