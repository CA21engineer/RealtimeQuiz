import React, { useCallback, useEffect } from 'react';
import { QuizPanelContainer } from 'container/QuizPanelContainer';
import { QuestionModal } from 'components/QuestionModal';
import { QuestionContent } from 'components/QuestionContent';
import { usePlayer } from './PlayerHooks';

import './player.scss';

export const Player: React.FC = () => {
  const {
    state,
    dispatch,
    clearReduceTimer,
    reduceTimerid,
    setReduceTimerId,
    expressPlayerStatus,
  } = usePlayer();

  const { roomStatus, personalStatus } = state;
  const { currentQuestion, currentTime, currentStatus } = roomStatus;
  const { isStartCountdownTimer } = personalStatus;

  useEffect(() => {
    if (
      currentStatus !== 'WAITING_ANSWER' ||
      isStartCountdownTimer ||
      !currentTime
    ) {
      return;
    }

    // カウントダウンを開始
    dispatch({
      type: 'SWITCH_COUNT_DOWN_TIMER',
      payload: {
        personalStatus: {
          isStartCountdownTimer: true,
        },
      },
    });

    const id = setInterval(() => {
      dispatch({ type: 'REDUCE_COUNT_DOWN_TIMER' });
    }, 1000);

    setReduceTimerId(id);
  }, [isStartCountdownTimer, currentTime, reduceTimerid, setReduceTimerId]);

  // 解答締め切り時にclearIntervalする
  useEffect(() => {
    if (currentStatus === 'WAITING_ANSWER' || !reduceTimerid) {
      return;
    }

    clearReduceTimer(reduceTimerid);
  }, [reduceTimerid, setReduceTimerId, currentStatus, clearReduceTimer]);

  // ページ遷移時ににclearIntervalする
  useEffect(() => {
    return () => {
      if (!reduceTimerid) {
        return;
      }

      clearReduceTimer(reduceTimerid);
    };
  }, []);

  const onSubmitAnswer: React.MouseEventHandler = useCallback(() => {
    const { emitter } = state.controllers;
    if (!emitter || personalStatus.answer === '') {
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
      !personalStatus.isSpectator &&
      roomStatus.currentStatus === 'WAITING_ANSWER' &&
      !personalStatus.isAnswered;

    return (
      <div className="Player__QuestionModal">
        <QuestionModal
          questionBody={roomStatus.currentQuestion || ''}
          closeTimeoutMS={500}
          remainTime={currentTime}
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
        <QuizPanelContainer
          roleType="player"
          highlight={roomStatus.currentStatus === 'OPEN_AGGREGATE'}
        />
      </div>
    </div>
  );
};
