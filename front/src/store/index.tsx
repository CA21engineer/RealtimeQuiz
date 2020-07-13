import React from 'react';
import { RoomStatusContextWrapper } from './roomStatus';
import { WebsocketControllerContextWrapper } from './websocketController';

export const Store: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  return (
    <WebsocketControllerContextWrapper>
      <RoomStatusContextWrapper>{children}</RoomStatusContextWrapper>
    </WebsocketControllerContextWrapper>
  );
};
