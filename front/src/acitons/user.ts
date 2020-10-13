import { UserSetting } from 'store/user';

export type Actions = ReturnType<typeof setVolume>;

const ActionType = {
  SWTICH_IS_PLAY_SOUND: 'SWTICH_IS_PLAY_SOUND',
} as const;

export const setVolume = (volume: UserSetting['volume']) =>
  ({
    type: ActionType.SWTICH_IS_PLAY_SOUND,
    payload: {
      volume,
    },
  } as const);
