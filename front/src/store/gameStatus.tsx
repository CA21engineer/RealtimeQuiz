import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { setAccountId, getAccountId } from 'websocket/libraries/AccountId';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { GameRoomStatusData, PlayerStatus } from 'websocket/interfaces/Status';
import { Emitter } from 'websocket/controllers/Emitter';
import { Receiver } from 'websocket/controllers/Receiver';

export type PersonalStatus = {
  answer: string;
  isAnswered: boolean;
  currentStatus: PlayerStatus | null;
  isSpectator: boolean;
  isStartCountdownTimer: boolean;
  isTimelimitChecked: boolean;
  timelimit: number;
};

export type Controller = {
  emitter: Emitter | null;
  receiver: Receiver | null;
};

export type GameStatus = {
  personalStatus: PersonalStatus;
  roomStatus: GameRoomStatusData;
  controllers: Controller;
};

const initialState: GameStatus = {
  personalStatus: {
    answer: '',
    isAnswered: false,
    currentStatus: null,
    isSpectator: false,
    isStartCountdownTimer: false,
    isTimelimitChecked: false,
    timelimit: 0,
  },
  roomStatus: {
    currentStatus: 'WAITING_QUESTION',
    currentQuestion: null,
    currentCorrectAnswer: null,
    currentTime: 0,
    players: [],
  },
  controllers: {
    emitter: null,
    receiver: null,
  },
};

enum Action {
  'UPDATE_STATUS' = 'UPDATE_STATUS',
  'INIT_CONTROLLERS' = 'INIT_CONTROLLERS',
  'ANSWER' = 'ANSWER',
  'EMIT_FORCE_ANSWER' = 'EMIT_FORCE_ANSWER',
  'UPDATE_PERSONAL_ANSWER' = 'UPDATE_PERSONAL_ANSWER',
  'SWITCH_COUNT_DOWN_TIMER' = 'SWITCH_COUNT_DOWN_TIMER',
  'REDUCE_COUNT_DOWN_TIMER' = 'REDUCE_COUNT_DOWN_TIMER',
  'SET_TIMELIMIT' = 'SET_TIMELIMIT',
}

export type GameStatusAction = {
  type: keyof typeof Action;
  payload?: {
    personalStatus?: { [P in keyof PersonalStatus]?: PersonalStatus[P] };
    status?: GameRoomStatusData;
    controllers?: Controller;

    // custom
    accountId?: string;
    isSpectator?: boolean;
  };
};

const reducer: Reducer<GameStatus, GameStatusAction> = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STATUS': {
      const status = action.payload?.status;
      if (!status) {
        console.error('status has undefined.');
        return state;
      }

      const { currentStatus, currentTime, players, currentQuestion, currentCorrectAnswer } = status;

      return produce(state, (draft) => {
        draft.roomStatus.currentStatus = currentStatus;
        draft.roomStatus.currentQuestion = currentQuestion;
        draft.roomStatus.currentCorrectAnswer = currentCorrectAnswer;
        draft.roomStatus.players = players;

        if (currentStatus === 'WAITING_QUESTION') {
          draft.personalStatus.answer = '';
          draft.personalStatus.isAnswered = false;
          draft.roomStatus.currentTime = null;
        }

        if (
          currentStatus === 'WAITING_ANSWER' &&
          !state.personalStatus.isStartCountdownTimer
        ) {
          draft.roomStatus.currentTime = currentTime;
        }

        const accountId = getAccountId();
        const selfStatus = status.players.filter(
          ({ id, connectionStatus }) =>
            id === accountId && connectionStatus === 'online'
        );

        if (selfStatus.length > 1) {
          console.error('同じIDのPlayerが存在しています');
        }

        if (selfStatus.length) {
          const self = selfStatus[0];
          draft.personalStatus.currentStatus = self;
        }
      });
    }

    case 'INIT_CONTROLLERS': {
      const controllers = action.payload?.controllers;
      if (!controllers) {
        console.error('controllers has undefined.');
        return state;
      }

      const accountId = action.payload?.accountId;
      if (accountId) {
        setAccountId(accountId);
      } else {
        console.error('accountId has undefined.');
      }

      return produce(state, (draft) => {
        draft.controllers = controllers;

        const isSpectator = action.payload?.isSpectator;
        draft.personalStatus.isSpectator = !!isSpectator;
      });
    }

    case 'ANSWER': {
      return produce(state, (draft) => {
        draft.personalStatus.isAnswered = true;
      });
    }

    // reducerの責務ではないが...
    case 'EMIT_FORCE_ANSWER': {
      const { personalStatus, controllers } = state;

      const { emitter } = controllers;
      if (!emitter) {
        console.error('emitter has null.');
        return state;
      }

      emitter.setAnswer(personalStatus.answer);
      return state;
    }

    case 'UPDATE_PERSONAL_ANSWER': {
      const answer = action.payload?.personalStatus?.answer;
      if (!answer) {
        console.error('answer payload has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        draft.personalStatus.answer = answer;
      });
    }

    case 'SWITCH_COUNT_DOWN_TIMER': {
      const isStartCountdownTimer =
        action.payload?.personalStatus?.isStartCountdownTimer;
      if (isStartCountdownTimer === undefined) {
        console.error('isStartCountdownTimer payload has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        draft.personalStatus.isStartCountdownTimer = isStartCountdownTimer;
      });
    }
    case 'REDUCE_COUNT_DOWN_TIMER': {
      return produce(state, (draft) => {
        const { currentTime } = state.roomStatus;
        if (currentTime === null || draft.roomStatus.currentTime === null) {
          console.error('制限時間の指定されていない問題です');
          return;
        }

        draft.roomStatus.currentTime -= 1;
      });
    }

    case 'SET_TIMELIMIT': {
      return produce(state, (draft) => {
        const { timelimit, isTimelimitChecked } =
          action.payload?.personalStatus ?? {};

        if (timelimit !== undefined) {
          draft.personalStatus.timelimit = timelimit;
        }

        if (isTimelimitChecked !== undefined) {
          draft.personalStatus.isTimelimitChecked = isTimelimitChecked;
        }
      });
    }

    default: {
      return state;
    }
  }
};

export type GameStatusDispatch = Dispatch<GameStatusAction>;
type ContextType = { state: GameStatus; dispatch: GameStatusDispatch };

export const GameStatusContext = createContext<ContextType>({} as ContextType);

export const GameStatusContextProvider = generateContextWrapper(
  GameStatusContext,
  reducer,
  initialState
);
