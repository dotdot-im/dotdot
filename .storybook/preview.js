import React from 'react';
import ddTheme from './ddTheme'

import { StateProvider } from 'store/state'

export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  docs: {
    theme: ddTheme,
  },
};

export const decorators = [
  (Story) => (
    <StateProvider>
      <Story />
    </StateProvider>
  ),
];