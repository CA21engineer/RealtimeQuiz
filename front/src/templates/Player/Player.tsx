import React, { useCallback, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { usePlayer } from './PlayerHooks';
import { QuizPanel } from '../../components/QuizPanel';
import { QuestionModal } from '../../components/QuestionModal';

import './player.scss';

export const Player: React.FC = () => {
  const { expressPlayerStatus } = usePlayer();
  const { state, dispatch } = useContext(GameStatusContext);
  const { roomStatus } = state;

  const onSubmitAnswer: React.MouseEventHandler = useCallback(() => {
    const { emitter } = state.controllers;
    if (!emitter) {
      console.error('解答が送信できませんでした。');
      return;
    }

    emitter.setAnswer(state.personalStatus.answer);
    dispatch({
      type: 'ANSWER',
    });
  }, [state, dispatch]);

  const renderQuestionModal = () => {
    const dispatchAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
      const answer = e.target.value;
      dispatch({
        type: 'UPDATE_PERSONAL_ANSWER',
        payload: {
          personalStatus: {
            answer,
          },
        },
      });
    };

    return (
      <div className="Player__QuestionModal">
        <QuestionModal
          questionBody={roomStatus.currentQuestion || ''}
          remainTime={0}
          answerBody=""
          onInputAnswer={dispatchAnswer}
          onSubmitAnswer={onSubmitAnswer}
          isOpen={roomStatus.currentStatus === 'OPEN_ANSWER'}
        />
      </div>
    );
  };
  const renderQuestionBody = () => {
    const { currentQuestion } = roomStatus;
    if (currentQuestion === '') {
      return null;
    }

    return <p className="Player__QuestionBox">{currentQuestion}</p>;
  };

  const renderUser = roomStatus.players.map((player) => {
    const answer = player.isAnswered ? '解答中...' : player.answer || '';
    return (
      <QuizPanel
        key={player.id}
        name={player.name}
        starNumber={player.stars}
        answerText={answer}
      />
    );
  });

  return (
    <div className="Player__Wrapper">
      <p className="Player__Question">
        {expressPlayerStatus(roomStatus.currentStatus)}
      </p>
      {renderQuestionBody()}
      {renderQuestionModal()}
      {renderUser}
    </div>
  );
};
