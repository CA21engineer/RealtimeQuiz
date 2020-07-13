import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { GameRoomStatusData } from 'interfaces/Status';
import { Emitter } from 'controllers/Emitter';
import { Receiver } from 'controllers/Receiver';

export type PersonalStatus = {
  answer: string;
};

export type Controller = {
  emitter: Emitter | null;
  receiver: Receiver | null;
};

export type GameStatus = {
  personalStatus: PersonalStatus;
  status: GameRoomStatusData;
  controllers: Controller;
};

const initialState: GameStatus = {
  personalStatus: {
    answer: '',
  },
  status: {
    currentStatus: 'WAITING_QUESTION',
    currentQuestion: null,
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
  'EMIT_FORCE_ANSWER' = 'EMIT_FORCE_ANSWER',
  'UPDATE_PERSONAL_ANSWER' = 'UPDATE_PERSONAL_ANSWER',
}

export type GameStatusAction = {
  type: keyof typeof Action;
  payload?: {
    personalStatus?: PersonalStatus;
    status?: GameRoomStatusData;
    controllers?: Controller;
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

      return produce(state, (draft) => {
        draft.status = status;
      });
    }

    case 'INIT_CONTROLLERS': {
      const controllers = action.payload?.controllers;
      if (!controllers) {
        console.error('controllers has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        draft.controllers = controllers;
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

    default: {
      return state;
    }
  }
};

type ContextType = { state: GameStatus; dispatch: Dispatch<GameStatusAction> };

export const GameStatusContext = createContext<ContextType>({} as ContextType);

export const GameStatusContextWrapper = generateContextWrapper(
  GameStatusContext,
  reducer,
  initialState
);
