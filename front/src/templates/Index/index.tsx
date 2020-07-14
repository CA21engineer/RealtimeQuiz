import React, { useState, useCallback, useEffect, useRef } from 'react';
import router from 'next/router';
import './index.scss';

import { FoundationInputArea } from 'components/FoundationInputArea';
import { RoomCard } from 'components/RoomCard';
import { getRoomList, createNewRoomThenGetInfo } from 'libraries/RoomAPI';
import { getAccountId } from 'libraries/AccountId';
import { RoomInformation } from 'interfaces/RoomList';

export const Index: React.FC = () => {
  const roomInputRef = useRef<HTMLInputElement>(null);
  const [rooms, setRooms] = useState<RoomInformation[]>([]);
  useEffect(() => {
    const setCurrentRooms = async () => {
      const currentRooms = await getRoomList();
      setRooms(currentRooms);
    };

    setCurrentRooms();
  }, []);

  const onEnterRoom = useCallback(async (roomName: string) => {
    const accountId = getAccountId();
    router.push(`/roomId/${roomName}/accountId/${accountId}`);
  }, []);

  const onEnterNewRoom = useCallback(async () => {
    const roomName = roomInputRef.current?.value;
    if (!roomName) {
      return;
    }

    const { accountId, roomId } = await createNewRoomThenGetInfo(roomName);
    router.push(`/roomId/${roomId}/accountId/${accountId}`);
  }, []);

  const renderRoomCards = rooms.map((room) => {
    return (
      <RoomCard
        key={room.roomId}
        title={room.roomName}
        roomInfo={`${room.participants}人が参加中`}
        onEnterRoom={() => onEnterRoom(room.roomId)}
      />
    );
  });

  return (
    <div className="Index__view">
      <h1 className="Index__Title">RealTime Quiz!</h1>
      <div className="Index__CreateNewRoom">
        <p className="Index__Description">新しく部屋を作る</p>
        <FoundationInputArea
          inputBody=""
          onClickSubmitButton={onEnterNewRoom}
          inputPlaceholder="部屋名を入力"
          submitLabel="部屋を作る"
          inputRef={roomInputRef}
        />
      </div>
      <div className="Index__RoomList">
        {renderRoomCards}
      </div>
    </div>
  );
};
