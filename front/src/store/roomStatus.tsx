import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { GameRoomStatusData } from 'interfaces/Status';

export type RoomStatus = GameRoomStatusData;

const initialState: RoomStatus = {
  currentStatus: 'WAITING_QUESTION',
  currentQuestion: null,
  players: [],
};

enum Action {
  'UPDATE_STATUS' = 'UPDATE_STATUS',
}

type RoomStatusAction = {
  type: keyof typeof Action;
  payload?: {
    status?: RoomStatus;
  };
};

const reducer: Reducer<RoomStatus, RoomStatusAction> = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STATUS': {
      const status = action.payload?.status;
      if (!status) {
        console.error('status has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        /* eslint no-param-reassign: 0 */
        draft = { ...draft, ...status };
      });
    }

    default: {
      return state;
    }
  }
};

type ContextType = { state: RoomStatus; dispatch: Dispatch<RoomStatusAction> };

export const RoomStatusContext = createContext<ContextType>({} as ContextType);

export const RoomStatusContextWrapper = generateContextWrapper(
  RoomStatusContext,
  reducer,
  initialState
);
