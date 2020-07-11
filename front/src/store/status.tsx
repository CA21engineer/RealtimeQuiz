import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';

export type Status = unknown;

export type StatusState = {
  status: Status[];
};

const initialState: StatusState = { status: [] };

enum Action {
  'INSERT' = 'INSERT',
  'DELETE' = 'DELETE',
}

type StatusAction = {
  type: keyof typeof Action;
  payload?: {
    status?: { [P in keyof Status]: Status[P] };
  };
};

const reducer: Reducer<StatusState, StatusAction> = (state, action) => {
  switch (action.type) {
    case 'INSERT': {
      const status = action.payload?.status;
      if (!status) {
        console.error('status has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        draft.status.push(status);
      });
    }

    default: {
      return state;
    }
  }
};

type ContextType = { state: StatusState; dispatch: Dispatch<StatusAction> };

export const StatusContext = createContext<ContextType>({} as ContextType);

export const StatusContextWrapper = generateContextWrapper(
  StatusContext,
  reducer,
  initialState
);
