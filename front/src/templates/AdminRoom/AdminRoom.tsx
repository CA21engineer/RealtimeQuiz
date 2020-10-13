import React, { useCallback, useEffect } from 'react';
import { getAnswerWithAdmin } from 'utils/getAnswer';
import { setCountDownTimer, reduceCountDownTimer } from 'acitons/gameStatus';
import { INIT_PLAYER_NAME } from 'constants/room';
import { FoundationButton } from 'components/FoundationButton';
import { QuizAdminPanel } from 'components/QuizAdminPanel';
import { QuestionContent } from 'components/QuestionContent';
import { useAdminRoom } from './AdminRoomHooks';

import './admin_room.scss';

export const AdminRoom: React.FC = () => {
  const {
    state,
    dispatch,
    clearReduceTimer,
    reduceTimerid,
    setReduceTimerId,
  } = useAdminRoom();
  const { roomStatus, controllers, personalStatus } = state;
  const { currentQuestion, currentCorrectAnswer, currentTime, currentStatus, players } = roomStatus;
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
    dispatch(setCountDownTimer(true));

    const id = setInterval(() => {
      dispatch(reduceCountDownTimer());
    }, 1000);

    setReduceTimerId(id);
  }, [isStartCountdownTimer, currentTime, reduceTimerid, setReduceTimerId]);

  // 解答締め切り時にclearIntervalする
  useEffect(() => {
    if (currentStatus === 'WAITING_ANSWER' || !reduceTimerid) {
      return;
    }

    clearReduceTimer(reduceTimerid, setReduceTimerId, dispatch);
  }, [reduceTimerid, setReduceTimerId, currentStatus, clearReduceTimer]);

  // ページ遷移時ににclearIntervalする
  useEffect(() => {
    return () => {
      if (!reduceTimerid) {
        return;
      }

      clearReduceTimer(reduceTimerid, setReduceTimerId, dispatch);
    };
  }, []);

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
      .filter(
        ({ role, name, connectionStatus }) =>
          role === 'player' &&
          name !== INIT_PLAYER_NAME &&
          connectionStatus === 'online'
      )
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
            emitAlterStar={(star) => emitAlterStars(player.id, star)}
          />
        );
      });
  };

  const timeMessage =
    currentTime === null ? '時間無制限' : `残り時間 ${currentTime}秒`;

  return (
    <div className="AdminRoom__view">
      <div className="AdminRoom__controller">
        <h1>問題を出題しています</h1>
        {currentStatus === 'WAITING_ANSWER' && <p>{timeMessage}</p>}
        <div className="AdminRoom__TextLabel">
          問題
        </div>
        {currentQuestion && <QuestionContent content={currentQuestion} />}
        {currentCorrectAnswer && (
          <>
            <div className="AdminRoom__TextLabel">
              答え
            </div>
            <QuestionContent content={currentCorrectAnswer} />
          </>
        )}
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
