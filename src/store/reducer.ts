import produce from "immer"

import { AppState, Action } from "./types";

export default produce((draft: AppState, action: Action) => {
  console.info('REDUCER: ', action.type);
  console.log(action.payload);
  switch (action.type) {
    case 'login':
      draft.auth.checked = true;

      if (!action.payload) {
        draft.auth.loggedIn = false;
        draft.auth.user = null;
        draft.auth.token = null;
        break;
      }

      draft.auth.loggedIn = true;
      draft.auth.user = action.payload.user;
      draft.auth.token = action.payload.token;
      break;
    case 'offline':
      draft.offline = true;
      break;
    case 'error':
      draft.error = action.payload;
      break;
    case 'socketConnected':
      draft.connected = action.payload;
      break;
  }
});