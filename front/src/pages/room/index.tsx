import React, { useCallback, useEffect, useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { Receiver } from 'controllers/Receiver';
import { WSConnection } from 'connections/WSConnection';

import './room.scss';

import { QuizPanel } from '../../components/QuizPanel';
import { expressRoomStatus } from './expressRoomStatus';
import { QuestionModal } from '../../components/QuestionModal';

const Room: React.FC = () => {
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
    // TODO: URLをちゃんとしたのに直す
    const connection = new WSConnection({
      roomId: 'hogehoge',
      accountId: 'hugahuga',
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
  }, []);

  const renderQuestionModal = () => {
    const dispatchAnswer = (answer: string) => {
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
      <div className="Room__QuestionModal">
        <QuestionModal
          questionBody={roomStatus.currentQuestion || ''}
          remainTime={0}
          answerBody=""
          onInputAnswer={dispatchAnswer}
          onSubmitAnswer={onSubmitAnswer}
          isOpen={roomStatus.currentStatus !== 'OPEN_ANSWER'}
        />
      </div>
    );
  };
  const renderQuestionBody = () => {
    const { currentQuestion } = roomStatus;
    if (currentQuestion === '') {
      return null;
    }

    return <p className="Room__QuestionBox">{currentQuestion}</p>;
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
    <div className="Room__Wrapper">
      <p className="Room__Question">
        {expressRoomStatus(roomStatus.currentStatus)}
      </p>
      {renderQuestionBody()}
      {renderQuestionModal()}
      {renderUser}
    </div>
  );
};

export default Room;
