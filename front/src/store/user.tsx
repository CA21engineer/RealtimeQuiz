import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { Actions } from 'acitons/user';

export type UserSetting = {
  isPlaySound: boolean;
};

export type User = {
  setting: UserSetting;
};

const initialState: User = {
  setting: {
    isPlaySound: true,
  },
};

const reducer: Reducer<User, Actions> = (state, action) => {
  switch (action.type) {
    case 'SWTICH_IS_PLAY_SOUND': {
      return produce(state, (draft) => {
        const { isPlaySound } = state.setting;
        draft.setting.isPlaySound = !isPlaySound;
      });
    }

    default: {
      return state;
    }
  }
};

export type UserDispatch = Dispatch<Actions>;
type ContextType = { state: User; dispatch: UserDispatch };

export const UserContext = createContext<ContextType>({} as ContextType);

export const UserContextProvider = generateContextWrapper(
  UserContext,
  reducer,
  initialState
);
