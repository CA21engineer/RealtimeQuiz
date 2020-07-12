import React from 'react';
import './foundationButton.scss';

type Props = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const FoundationButton: React.FC<Props> = ({ label, onClick }) => {
  return (
    <button type="button" className="foundation__button" onClick={onClick}>
      {label}
    </button>
  );
};
