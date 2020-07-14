import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { QuizAdminPanel } from '../components/QuizAdminPanel/QuizAdminPanel';

storiesOf('QuizAdminPanel', module).add('default', () => {
  return (
    <QuizAdminPanel
      name="赤木しげる"
      starNumber={5}
      answerText="未回答"
      isOnline
    />
  );
});
