import React from 'react';
import { FoundationButton } from '../FoundationButton';
import './foundationInputArea.scss';

type Props = {
  inputBody: string;
  onInputAnswer?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSubmitButton: React.MouseEventHandler;
  inputPlaceholder: string;
  submitLabel: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

export const FoundationInputArea: React.FC<Props> = ({
  inputBody,
  onInputAnswer,
  onClickSubmitButton,
  inputPlaceholder,
  submitLabel,
  inputRef,
}) => {
  return (
    <div className="FoundationInputArea">
      <input
        className="FoundationInputArea__Input"
        type="text"
        defaultValue={inputBody}
        placeholder={inputPlaceholder}
        onChange={onInputAnswer}
        ref={inputRef}
      />
      <div className="FoundationInputArea__Submit">
        <FoundationButton label={submitLabel} onClick={onClickSubmitButton} />
      </div>
    </div>
  );
};
