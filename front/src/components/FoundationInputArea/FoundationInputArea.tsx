import React from 'react';
import { FoundationButton } from '../FoundationButton';
import './foundationInputArea.scss';

type Props = {
  inputBody: string;
  onInputAnswer: (input: string) => void;
  onClickSubmitButton: React.MouseEventHandler;
  inputPlaceholder: string;
  submitLabel: string;
};

export const FoundationInputArea: React.FC<Props> = ({
  inputBody,
  onInputAnswer,
  onClickSubmitButton,
  inputPlaceholder,
  submitLabel,
}) => {
  return (
    <>
      <input
        className="FoundationInputArea__Input"
        type="text"
        value={inputBody}
        placeholder={inputPlaceholder}
        onChange={(e) => {
          onInputAnswer(e.target.value);
        }}
      />
      <div className="FoundationInputArea__Submit">
        <FoundationButton label={submitLabel} onClick={onClickSubmitButton} />
      </div>
    </>
  );
};
