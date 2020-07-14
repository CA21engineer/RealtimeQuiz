import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { GameStatusContext } from 'store/gameStatus';
import { Receiver } from 'controllers/Receiver';
import { WSConnection } from 'connections/WSConnection';
import { Player } from 'templates/Player';
import { AdminResult } from 'templates/AdminResult';
import { AdminSubmitQuestion } from 'templates/AdminSubmitQuestion';
import { AdminRoom } from 'templates/AdminRoom';

const RoomPage: React.FC = () => {
  const { query } = useRouter();
  const { state, dispatch } = useContext(GameStatusContext);
  const { personalStatus, roomStatus } = state;
  const { currentStatus } = personalStatus;

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

  if (!currentStatus) {
    return null;
  }

  switch (currentStatus.role) {
    case 'player':
      return <Player />;

    case 'admin':
      switch (roomStatus.currentStatus) {
        case 'WAITING_QUESTION': {
          return <AdminSubmitQuestion />;
        }

        case 'OPEN_ANSWER': {
          return <AdminResult />;
        }

        case 'CLOSE_ANSWER':
        case 'OPEN_AGGRIGATE':
        case 'WAITING_ANSWER': {
          return <AdminRoom />;
        }

        default: {
          throw new Error('部屋の状態が不明です');
        }
      }

    default:
      // TODO: サスペンドの追加
      return null;
  }
};

export default RoomPage;
