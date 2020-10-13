import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { devlog } from 'utils/log';
import { QuestionModal } from '../components/QuestionModal';

storiesOf('QuestionModal', module).add('default', () => {
  return (
    <QuestionModal
      questionBody="カイジの人間ダービーで石田さんはなんと言って奈落へ落ちていったでしょうか"
      remainTime={10}
      answerBody=""
      onInputAnswer={(e: React.ChangeEvent<HTMLInputElement>) =>
        console.log(e.target.value)}
      onSubmitAnswer={() => {
        devlog.log('None of arguments');
      }}
      isOpen
    />
  );
});
