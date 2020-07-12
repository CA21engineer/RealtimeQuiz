import React from 'react';
import './questionModal.scss';
import { FoundationButton } from '../FoundationButton';
import { logger } from '../../utils/log';

type Props = {
  questionBody: string;
  remainTime: number;
  answerBody: string;
  onInputAnswer: (text: string) => void;
  onSubmitAnswer: React.MouseEventHandler;
};

export const QuestionModal: React.FC<Props> = ({
  questionBody,
  remainTime,
  answerBody,
  onInputAnswer,
  onSubmitAnswer,
}) => {
  if (questionBody === '') {
    logger('Fatal: Question body is not given.');
  }
  if (Number.isNaN(remainTime)) {
    logger(
      'Fatal: Question modal is given NaN. Please check code. For there is mistake.'
    );
  }

  return (
    <div className="QuestionModal__Container">
      <h2 className="QuestionModal__Title">問題</h2>
      <h3 className="QuestionModal__QuestionBody">{questionBody}</h3>
      <span className="QuestionModal__RemainTime">{`残り時間 ${remainTime}秒`}</span>
      <input
        className="QuestionModal__Input"
        type="text"
        value={answerBody}
        placeholder="回答を入力"
        onChange={(e) => {
          onInputAnswer(e.target.value);
        }}
      />
      <div className="QuestionModal__Submit">
        <FoundationButton label="回答する" onClick={onSubmitAnswer} />
      </div>
    </div>
  );
};
