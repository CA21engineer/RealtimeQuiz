import { UserSetting } from 'store/user';
import useSound from 'use-sound';

export const useSoundByStatus = (
  isPlaySound: UserSetting['isPlaySound'],
  source: any
) => {
  const [play] = useSound(source);
  return {
    play: isPlaySound ? play : () => {},
  };
};
