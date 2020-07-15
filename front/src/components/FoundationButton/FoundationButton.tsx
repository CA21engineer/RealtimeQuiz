import React from 'react';
import './foundationButton.scss';

type Props = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export const FoundationButton: React.FC<Props> = ({
  label,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      className="foundation__button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
