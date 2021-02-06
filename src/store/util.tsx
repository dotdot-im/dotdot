import React from 'react';
import { initialState, StateProvider } from 'store/state';
import { AppState } from './types';

export const stateDecorator = (stateOverrides: Partial<AppState>) => (
  Story: React.FunctionComponent
) => {
  const state = {
    ...initialState,
    ...stateOverrides,
  };
  return (
    <StateProvider state={state}>
      <Story />
    </StateProvider>
  );
};

export default stateDecorator;
