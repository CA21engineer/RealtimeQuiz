import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { TestLabel } from '../components/TestLabel';

storiesOf('TestLabel', module).add('with text', () => {
  return <TestLabel title="Click Me" />;
});
