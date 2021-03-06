import React from 'react';
import { INIT_PLAYER_NAME } from 'constants/room';
import { getAccountId } from 'websocket/libraries/AccountId';
import { getAnswerWithPlayer, getAnswerWithAdmin } from 'utils/getAnswer';
import { PlayerStatus } from 'websocket/interfaces/Status';
import { QuizPanel } from 'components/QuizPanel';
import { useQuizPanelContainer } from './QuizPanelContainerHooks';
import './quizPanelContainer.scss';

type QuizPanelContainerType = {
  roleType: PlayerStatus['role'];
  highlight?: boolean;
};

export const QuizPanelContainer: React.FC<QuizPanelContainerType> = ({
  roleType,
  highlight = false,
}: QuizPanelContainerType) => {
  const { roomStatus, getPlusMinus } = useQuizPanelContainer();

  const accountId = getAccountId();

  const filter =
    roleType === 'admin' ? getAnswerWithAdmin : getAnswerWithPlayer;

  const renderUser = roomStatus.players
    .filter(
      ({ role, name, connectionStatus }) =>
        role === 'player' &&
        name !== INIT_PLAYER_NAME &&
        connectionStatus === 'online'
    )
    .sort((a, b) => b.stars - a.stars)
    .sort((a) => (a.id === accountId ? -1 : 1))
    .map((player) => {
      const answer = filter(
        roomStatus.currentStatus,
        player.isAnswered,
        player.answer || ''
      );

      const plusMinus = highlight ? getPlusMinus(player.alterStars) : 'None';

      return (
        <QuizPanel
          key={player.id}
          name={player.name}
          starNumber={player.stars}
          answerText={answer}
          plusMinus={plusMinus}
          isOnline={player.connectionStatus === 'online'}
        />
      );
    });

  return <div className="quizPanelContainer">{renderUser}</div>;
};
