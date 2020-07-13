import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { QuestionModal } from '../components/QuestionModal';
import { logger } from '../utils/log';

storiesOf('QuestionModal', module).add('default', () => {
  return (
    <QuestionModal
      questionBody="カイジの人間ダービーで石田さんはなんと言って奈落へ落ちていったでしょうか"
      remainTime={10}
      answerBody=""
      onInputAnswer={(text: string) => logger(text)}
      onSubmitAnswer={() => {
        logger('None of arguments');
      }}
      isOpen
    />
  );
});
