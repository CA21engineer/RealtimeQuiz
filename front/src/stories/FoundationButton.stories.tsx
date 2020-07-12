import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { FoundationButton } from '../components/FoundationButton/FoundationButton';

storiesOf('FoundationButton', module).add('with text', () => {
  return (
    <FoundationButton
      label="Click Me"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(e.target);
      }}
    />
  );
});
