import React from 'react';
import Modal from 'react-modal';
import { devlog } from 'utils/log';
import { FoundationInputArea } from 'components/FoundationInputArea';
import { QuestionContent } from 'components/QuestionContent';

import './questionModal.scss';

type Props = {
  questionBody: string;
  remainTime: number | null;
  answerBody: string;
  onInputAnswer: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAnswer: React.MouseEventHandler;
  isOpen: boolean;
  closeTimeoutMS?: number;
};

export const QuestionModal: React.FC<Props> = ({
  questionBody,
  remainTime,
  answerBody,
  onInputAnswer,
  onSubmitAnswer,
  isOpen,
  closeTimeoutMS,
}) => {
  if (questionBody === '' && isOpen) {
    devlog.warn('Fatal: Question body is not given.');
  }

  if (Number.isNaN(remainTime)) {
    devlog.warn(
      'Fatal: Question modal is given NaN. Please check code. For there is mistake.'
    );
  }

  const timeMessage =
    remainTime === null ? '時間無制限' : `残り時間 ${remainTime}秒`;

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={closeTimeoutMS}
      className="QuestionModal__Wrapper"
    >
      <div className="QuestionModal__Container">
        <h2 className="QuestionModal__Title">問題</h2>
        <QuestionContent
          className="QuestionModal__QuestionBody"
          content={questionBody}
        />
        <span className="QuestionModal__RemainTime">{timeMessage}</span>
        <FoundationInputArea
          inputBody={answerBody}
          onInputAnswer={onInputAnswer}
          onClickSubmitButton={onSubmitAnswer}
          inputPlaceholder="回答を入力"
          submitLabel="回答する"
        />
      </div>
    </Modal>
  );
};
