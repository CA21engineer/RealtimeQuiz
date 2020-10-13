import React, { useCallback } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

import './backButton.scss';

type BackButtonProps = {
  className?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({
  className,
}: BackButtonProps) => {
  const { back } = useRouter();

  const handleClick = useCallback(() => {
    back();
  }, [back]);

  return (
    <button
      className={cx('BackButton__Button', className)}
      type="button"
      onClick={handleClick}
    >
      <FaArrowLeft className="BackButton__Icon" />
    </button>
  );
};
