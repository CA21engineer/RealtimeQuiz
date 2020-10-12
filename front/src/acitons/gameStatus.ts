import { Controller, RoomStatus, PersonalStatus } from 'store/gameStatus';

export type Actions =
  | ReturnType<typeof updateGameRoomStatus>
  | ReturnType<typeof initController>
  | ReturnType<typeof setIsSpectator>
  | ReturnType<typeof setIsAnswered>
  | ReturnType<typeof emitForceAnswer>
  | ReturnType<typeof updatePersonalAnswer>
  | ReturnType<typeof setCountDownTimer>
  | ReturnType<typeof reduceCountDownTimer>
  | ReturnType<typeof setTimeLimitNumber>
  | ReturnType<typeof setEnableTimeLimit>;

const actionType = {
  UPDATE_STATUS: 'UPDATE_STATUS',
  INIT_CONTROLLERS: 'INIT_CONTROLLERS',
  SET_IS_SPECTATOR: 'SET_IS_SPECTATOR',
  SET_IS_ANSWERED: 'SET_IS_ANSWERED',
  EMIT_FORCE_ANSWER: 'EMIT_FORCE_ANSWER',
  UPDATE_PERSONAL_ANSWER: 'UPDATE_PERSONAL_ANSWER',
  SET_COUNT_DOWN_TIMER: 'SET_COUNT_DOWN_TIMER',
  REDUCE_COUNT_DOWN_TIMER: 'REDUCE_COUNT_DOWN_TIMER',
  SET_TIME_LIMIT_NUMBER: 'SET_TIME_LIMIT_NUMBER',
  SET_ENABLE_TIME_LIMIT: 'SET_ENABLE_TIME_LIMIT',
} as const;

export const updateGameRoomStatus = (status: RoomStatus) =>
  ({
    type: actionType.UPDATE_STATUS,
    payload: {
      status,
    },
  } as const);

export const initController = (controller: Controller) =>
  ({
    type: actionType.INIT_CONTROLLERS,
    payload: {
      controller,
    },
  } as const);

export const setIsSpectator = (isSpectator: PersonalStatus['isSpectator']) =>
  ({
    type: actionType.SET_IS_SPECTATOR,
    payload: {
      isSpectator,
    },
  } as const);

export const setIsAnswered = () =>
  ({
    type: actionType.SET_IS_ANSWERED,
  } as const);

export const emitForceAnswer = () =>
  ({
    type: actionType.EMIT_FORCE_ANSWER,
  } as const);

export const updatePersonalAnswer = (answer: PersonalStatus['answer']) =>
  ({
    type: actionType.UPDATE_PERSONAL_ANSWER,
    payload: {
      answer,
    },
  } as const);

export const setCountDownTimer = (
  isStartCountdownTimer: PersonalStatus['isStartCountdownTimer']
) =>
  ({
    type: actionType.SET_COUNT_DOWN_TIMER,
    payload: {
      isStartCountdownTimer,
    },
  } as const);

export const reduceCountDownTimer = () =>
  ({
    type: actionType.REDUCE_COUNT_DOWN_TIMER,
  } as const);

export const setTimeLimitNumber = (timelimit: PersonalStatus['timelimit']) =>
  ({
    type: actionType.SET_TIME_LIMIT_NUMBER,
    payload: {
      timelimit,
    },
  } as const);

export const setEnableTimeLimit = (
  isTimelimitChecked: PersonalStatus['isTimelimitChecked']
) =>
  ({
    type: actionType.SET_ENABLE_TIME_LIMIT,
    payload: {
      isTimelimitChecked,
    },
  } as const);
