import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { GameStatusContext } from 'store/gameStatus';
import { Receiver } from 'controllers/Receiver';
import { WSConnection } from 'connections/WSConnection';
import { Player } from 'templates/Player';

const RoomPage: React.FC = () => {
  const { query } = useRouter();
  const { state, dispatch } = useContext(GameStatusContext);
  const role = state.personalStatus.currentStatus?.role;

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

  switch (role) {
    case 'player':
      return <Player />;

    default:
      // TODO: サスペンドの追加
      return null;
  }
};

export default RoomPage;
