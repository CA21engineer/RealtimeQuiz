import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { RoomCard } from '../components/RoomCard';

storiesOf('RoomCard', module).add('with text', () => {
  return <RoomCard title="鷲巣麻雀" roomInfo="2人参加中" />;
});
