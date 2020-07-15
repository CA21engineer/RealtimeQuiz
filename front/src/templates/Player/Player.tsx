import React, { useCallback, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { QuizPanelContainer } from 'container/QuizPanelContainer';
import { QuestionModal } from 'components/QuestionModal';
import { QuestionContent } from 'components/QuestionContent';
import { usePlayer } from './PlayerHooks';

import './player.scss';

export const Player: React.FC = () => {
  const { expressPlayerStatus } = usePlayer();
  const { state, dispatch } = useContext(GameStatusContext);
  const { roomStatus, personalStatus } = state;
  const { currentQuestion } = roomStatus;

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
      if (answer === '') {
        return;
      }

      dispatch({
        type: 'UPDATE_PERSONAL_ANSWER',
        payload: {
          personalStatus: {
            answer,
          },
        },
      });
    };

    const role = personalStatus?.currentStatus?.role;
    if (!role) {
      return null;
    }

    const isOpen =
      role !== 'spectator' &&
      roomStatus.currentStatus === 'WAITING_ANSWER' &&
      !personalStatus.isAnswered;

    return (
      <div className="Player__QuestionModal">
        <QuestionModal
          questionBody={roomStatus.currentQuestion || ''}
          remainTime={0}
          answerBody=""
          onInputAnswer={dispatchAnswer}
          onSubmitAnswer={onSubmitAnswer}
          isOpen={isOpen}
        />
      </div>
    );
  };

  return (
    <div className="Player__Wrapper">
      <p className="Player__Status">
        {expressPlayerStatus(roomStatus.currentStatus)}
      </p>
      {currentQuestion && (
      <div className="Player__Question">
        <QuestionContent content={currentQuestion} />
      </div>
    )}
      {renderQuestionModal()}
      <div className="Player__List">
        <QuizPanelContainer roleType="player" />
      </div>
    </div>
  );
};
