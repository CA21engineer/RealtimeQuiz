import React, { useContext, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import cx from 'classnames';
import { UserContext } from 'store/user';
import { setVolume } from 'acitons/user';
import { FoundationSlider } from 'components/FoundationSlider';

import './volumeSlider.scss';

type VolumeSliderProps = {
  className?: string;
};

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  className,
}: VolumeSliderProps) => {
  const { state, dispatch } = useContext(UserContext);
  const updateVolumeOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      dispatch(setVolume(value));
    },
    [dispatch]
  );

  return (
    <div className={cx('VolumeSlider__Container', className)}>
      <FaVolumeMute />
      <FoundationSlider
        className="VolumeSlider__Slider"
        defaultValue={state.setting.volume}
        min={0}
        step={0.1}
        max={1}
        onChange={updateVolumeOnChange}
      />
      <FaVolumeUp />
    </div>
  );
};
