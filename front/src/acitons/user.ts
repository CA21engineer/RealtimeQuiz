export type Actions = ReturnType<typeof switchIsPlaySound>;

const ActionType = {
  SWTICH_IS_PLAY_SOUND: 'SWTICH_IS_PLAY_SOUND',
} as const;

export const switchIsPlaySound = () =>
  ({
    type: ActionType.SWTICH_IS_PLAY_SOUND,
  } as const);
