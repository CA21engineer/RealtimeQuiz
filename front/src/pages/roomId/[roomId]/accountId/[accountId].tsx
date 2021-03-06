import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { INIT_PLAYER_NAME } from 'constants/room';
import { GameStatusContext } from 'store/gameStatus';
import { initController, setIsSpectator } from 'acitons/gameStatus';
import { setAccountId } from 'websocket/libraries/AccountId';
import { Receiver } from 'websocket/controllers/Receiver';
import { createWSConnection } from 'websocket/connections/WSConnection';
import { RoomEntrance } from 'templates/RoomEntrance';
import { Player } from 'templates/Player';
import { AdminResult } from 'templates/AdminResult';
import { AdminSubmitQuestion } from 'templates/AdminSubmitQuestion';
import { AdminRoom } from 'templates/AdminRoom';
import { Loading } from 'templates/Loading';

const RoomPage: React.FC = () => {
  const { query } = useRouter();
  const { state, dispatch } = useContext(GameStatusContext);
  const { personalStatus, roomStatus } = state;
  const { currentStatus } = personalStatus;

  useEffect(() => {
    const { roomId, accountId, isSpectator } = query;

    if (typeof roomId !== 'string' || typeof accountId !== 'string') {
      return;
    }

    const connection = createWSConnection({
      roomId,
      accountId,
    });
    const receiver = new Receiver(dispatch);
    connection.setReceivers(receiver);
    const emitter = connection.createEmitter();

    dispatch(
      initController({
        emitter,
        receiver,
      })
    );
    dispatch(setIsSpectator(isSpectator === 'true'));
    setAccountId(accountId);
  }, [query]);

  if (!currentStatus) {
    return <Loading />;
  }

  if (personalStatus.isSpectator) {
    return <Player />;
  }

  switch (currentStatus.role) {
    case 'player':
      if (currentStatus.name === INIT_PLAYER_NAME) {
        return <RoomEntrance />;
      }

      return <Player />;

    case 'admin':
      switch (roomStatus.currentStatus) {
        case 'WAITING_QUESTION': {
          return <AdminSubmitQuestion />;
        }

        case 'OPEN_AGGREGATE': {
          return <AdminResult />;
        }

        case 'OPEN_ANSWER':
        case 'CLOSE_ANSWER':
        case 'WAITING_ANSWER': {
          return <AdminRoom />;
        }

        default: {
          throw new Error('部屋の状態が不明です');
        }
      }

    default:
      return <Loading />;
  }
};

export default RoomPage;
