import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { QuizAdminPanel } from '../components/QuizAdminPanel/QuizAdminPanel';

storiesOf('QuizAdminPanel', module).add('default', () => {
  return (
    <QuizAdminPanel
      name="赤木しげる"
      starsNumber={5}
      alterStarsNumber={5}
      answerText="未回答"
      isOnline
      changeColor
      isAnswered
      emitAlterStar={(star) => console.log(star)}
    />
  );
});
