import { createContext, Reducer, Dispatch } from 'react';
import produce from 'immer';
import { generateContextWrapper } from 'utils/store/contextHelper';
import { Actions } from 'acitons/user';

export type UserSetting = {
  volume: number;
};

export type User = {
  setting: UserSetting;
};

const initialState: User = {
  setting: {
    volume: 0.5,
  },
};

const reducer: Reducer<User, Actions> = (state, action) => {
  switch (action.type) {
    case 'SWTICH_IS_PLAY_SOUND': {
      const { volume } = action.payload;
      return produce(state, (draft) => {
        if (volume < 0 || volume > 1) {
          console.error('音量の規定値を超えています', volume);
          return;
        }

        draft.setting.volume = volume;
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
