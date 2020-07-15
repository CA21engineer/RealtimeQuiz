import React, { useCallback, useContext } from 'react';
import { getAnswerWithAdmin } from 'utils/getAnswer';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationButton } from 'components/FoundationButton';
import { QuizAdminPanel } from 'components/QuizAdminPanel';
import { QuestionContent } from 'components/QuestionContent';

import './admin_room.scss';

export const AdminRoom: React.FC = () => {
  const { state } = useContext(GameStatusContext);
  const { roomStatus, controllers } = state;
  const { players, currentQuestion, currentStatus } = roomStatus;

  const EmitCloseApplications = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.closeApplications();
  }, [controllers]);

  const emitOpenAnswers = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.openAnswers();
  }, [controllers]);

  const emitGotoResult = useCallback(() => {
    if (!controllers.emitter) {
      return;
    }

    controllers.emitter.GotoResult();
  }, [controllers]);

  const emitAlterStars = useCallback(
    (id: string, alterStars: number) => {
      if (!controllers.emitter) {
        return;
      }

      controllers.emitter.setAlterStars({
        alterStars: [{ accountId: id, alterStars }],
      });
    },
    [controllers]
  );

  const renderQuizAdminPanels = () => {
    return players
      .filter(({ role }) => role === 'player')
      .sort((a, b) => b.stars - a.stars)
      .map((player) => {
        const answer = getAnswerWithAdmin(
          roomStatus.currentStatus,
          player.isAnswered,
          player.answer || ''
        );

        return (
          <QuizAdminPanel
            key={player.id}
            name={player.name}
            starsNumber={player.stars}
            alterStarsNumber={player.alterStars}
            answerText={answer}
            isOnline={player.connectionStatus === 'online'}
            isAnswered={player.isAnswered}
            changeColor={currentStatus !== "WAITING_QUESTION"}
            emitAlterStar={(star) => emitAlterStars(player.id, star)}
          />
        );
      });
  };

  return (
    <div className="AdminRoom__view">
      <div className="AdminRoom__controller">
        <h1>問題を出題しています</h1>
        {currentQuestion && <QuestionContent content={currentQuestion} />}
        <div className="AdminRoom__Buttons">
          <FoundationButton
            label="解答を締め切る"
            onClick={EmitCloseApplications}
            disabled={currentStatus !== 'WAITING_ANSWER'}
          />
          <FoundationButton
            label="一斉にオープン"
            onClick={emitOpenAnswers}
            disabled={currentStatus !== 'CLOSE_ANSWER'}
          />
          <FoundationButton
            label="結果発表"
            onClick={emitGotoResult}
            disabled={currentStatus !== 'OPEN_ANSWER'}
          />
        </div>
      </div>
      <div className="AdminRoom__Panels">{renderQuizAdminPanels()}</div>
    </div>
  );
};
