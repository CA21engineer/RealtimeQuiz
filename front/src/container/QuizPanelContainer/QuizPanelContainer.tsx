import React from 'react';
import { getAnswerWithPlayer, getAnswerWithAdmin } from 'utils/getAnswer';
import { PlayerStatus } from 'interfaces/Status';
import { QuizPanel } from 'components/QuizPanel';
import { useQuizPanelContainer } from './QuizPanelContainerHooks';
import './quizPanelContainer.scss';

type QuizPanelContainerType = {
  roleType: PlayerStatus['role'];
};

export const QuizPanelContainer: React.FC<QuizPanelContainerType> = ({
  roleType,
}: QuizPanelContainerType) => {
  const { roomStatus } = useQuizPanelContainer();

  const filter =
    roleType === 'admin' ? getAnswerWithAdmin : getAnswerWithPlayer;

  const renderUser = roomStatus.players
    .filter(({ role }) => role === 'player')
    .sort((a, b) => b.stars - a.stars)
    .map((player) => {
      const answer = filter(
        roomStatus.currentStatus,
        player.isAnswered,
        player.answer || ''
      );

      return (
        <QuizPanel
          key={player.id}
          name={player.name}
          starNumber={player.stars}
          answerText={answer}
        />
      );
    });

  return <>{renderUser}</>;
};
