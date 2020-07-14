import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { QuizPanel } from '../components/QuizPanel/QuizPanel';

storiesOf('QuizPanel', module).add('default', () => {
  return (
    <QuizPanel
      name="赤木しげる"
      starNumber={5}
      answerText="未回答"
      isOnline
    />
  );
});
