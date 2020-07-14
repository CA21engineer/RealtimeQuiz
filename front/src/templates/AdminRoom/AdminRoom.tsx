import React, { useEffect, useCallback, useContext, useState } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizAdminPanel } from 'components/QuizAdminPanel';

import './admin_room.scss';

export const AdminRoom: React.FC = () => {
  const [alterStarsRef, setAlterStarsRef] = useState<
    React.RefObject<HTMLInputElement>[]
  >();
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { players, currentQuestion } = roomStatus;

  const EmitCloseApplications = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.goToNextQuestion();
  }, [controllers]);

  const emitOpenAnswers = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.openAnswers();
  }, [controllers]);

  const emitAlterStars = useCallback(() => {
    if (!controllers.emitter || !alterStarsRef) {
      return;
    }

    const data = alterStarsRef.map((ref, index) => {
      return {
        accountId: players[index].id,
        alterStars: Number(ref.current?.value) || 0,
      };
    });

    controllers.emitter.setAlterStars({
      alterStars: data,
    });
  }, [controllers]);

  useEffect(() => {
    const refs = [...Array(roomStatus.players.length)].map(() =>
      React.createRef<HTMLInputElement>()
    );

    setAlterStarsRef(refs);
  }, [roomStatus]);

  const renderQuizAdminPanels = () => {
    if (!alterStarsRef || !alterStarsRef.length) {
      return null;
    }

    return players.map((player, index) => {
      const answer = player.isAnswered ? '解答中...' : player.answer || '';

      return (
        <QuizAdminPanel
          key={player.id}
          name={player.name}
          starNumber={player.stars}
          answerText={answer}
          starsRef={alterStarsRef[index]}
        />
      );
    });
  };

  return (
    <div className="AdminRoom__view">
      <div>
        <h1>問題を出題しています</h1>
        {currentQuestion && (
          <input className="AdminRoom__QuestionBox" value={currentQuestion} />
        )}
        <FoundationButton
          label="解答を締め切る"
          onClick={EmitCloseApplications}
        />
        <FoundationButton label="一斉にオープン" onClick={emitOpenAnswers} />
        <FoundationButton label="結果発表" onClick={emitAlterStars} />
        {renderQuizAdminPanels()}
      </div>
    </div>
  );
};
