import React, { useCallback, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { GameStatusContext } from 'store/gameStatus';
import { Receiver } from 'controllers/Receiver';
import { WSConnection } from 'connections/WSConnection';
import { usePlayer } from './PlayerHooks';
import { QuizPanel } from '../../components/QuizPanel';
import { QuestionModal } from '../../components/QuestionModal';

import './player.scss';

export const Player: React.FC = () => {
  const { query } = useRouter();
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

  useEffect(() => {
    const { roomId } = query;
    const { accountId } = query;

    if (typeof roomId !== 'string' || typeof accountId !== 'string') {
      return;
    }

    const connection = new WSConnection({
      roomId,
      accountId,
    });
    const receiver = new Receiver(dispatch);
    connection.setReceivers(receiver);
    const emitter = connection.createEmitter();

    dispatch({
      type: 'INIT_CONTROLLERS',
      payload: {
        controllers: {
          emitter,
          receiver,
        },
      },
    });
  }, [query]);

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
