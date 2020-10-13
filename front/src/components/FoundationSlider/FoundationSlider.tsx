import React from 'react';
import cx from 'classnames';
import './foundationSlider.scss';

type FoundationSliderProps = Omit<React.ComponentProps<'input'>, 'type'>;

export const FoundationSlider: React.FC<FoundationSliderProps> = ({
  className,
  ...rest
}: FoundationSliderProps) => {
  return (
    <input
      className={cx('FoundationSlider__Slider', className)}
      type="range"
      {...rest}
    />
  );
};

