import React, { useReducer } from 'react';

type ContextValueType<T, A> = {
  state: T;
  dispatch: React.Dispatch<A>;
};

type ContextWrapperType = {
  children: React.ReactChild;
};

export function generateContextWrapper<T, A>(
  Context: React.Context<ContextValueType<T, A>>,
  reducer: React.Reducer<T, A>,
  initialState: T
): React.FC<ContextWrapperType> {
  const ContextWrapper: React.FC<ContextWrapperType> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <Context.Provider value={{ state, dispatch }}>
        {children}
      </Context.Provider>
    );
  };

  return ContextWrapper;
}
