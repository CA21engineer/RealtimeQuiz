import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { Emitter } from 'controllers/Emitter';
import { Receiver } from 'controllers/Receiver';

export type WebsocketController = {
  emitter: Emitter | null;
  receiver: Receiver | null;
};

const initialState: WebsocketController = { emitter: null, receiver: null };

enum Action {
  'INIT' = 'INIT',
}

type WebsocketControllerAction = {
  type: keyof typeof Action;
  payload?: {
    controllers?: WebsocketController;
  };
};

const reducer: Reducer<WebsocketController, WebsocketControllerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'INIT': {
      const controllers = action.payload?.controllers;
      if (!controllers) {
        console.error('controllers has undefined.');
        return state;
      }

      return produce(state, (draft) => {
        /* eslint no-param-reassign: 0 */
        draft = Object.assign(draft, controllers);
      });
    }

    default: {
      return state;
    }
  }
};

type ContextType = {
  state: WebsocketController;
  dispatch: Dispatch<WebsocketControllerAction>;
};

export const WebsocketControllerContext = createContext<ContextType>(
  {} as ContextType
);

export const WebsocketControllerContextWrapper = generateContextWrapper(
  WebsocketControllerContext,
  reducer,
  initialState
);
