import React, { useCallback, useContext, useRef } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { FoundationInputArea } from 'components/FoundationInputArea';

import './roomEntrance.scss';

export const RoomEntrance: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(GameStatusContext);
  const { controllers } = state;

  const emitChangeName = useCallback(() => {
    if (!nameRef.current || !controllers.emitter) {
      return;
    }

    const name = nameRef.current.value;
    if (name === '') {
      return;
    }

    controllers.emitter.changeName(name);
  }, [controllers, nameRef]);
  return (
    <div className="Room__view">
      <p className="Room__label">ニックネームを入力してください．</p>
      <FoundationInputArea
        inputBody=""
        onClickSubmitButton={emitChangeName}
        inputPlaceholder="ニックネーム"
        submitLabel="入室"
        inputRef={nameRef}
      />
    </div>
  );
};
