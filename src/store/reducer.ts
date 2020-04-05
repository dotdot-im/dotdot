import produce from "immer"

import { AppState, Action } from "./types";

// TODO NEW BLOG POST
// const REDUCER = {
//   [REDUX_CONSTANTS.LOGIN]: (draft, payload) => {},
// };

export default produce((draft: AppState, action: Action) => {
  // REDUCER[action.type](draft, action.payload);

  console.log('REDUCER', action);

  switch (action.type) {
    case 'login':
      if (!draft.offline) {
        draft.auth.checked = true;
      }

      draft.error = null;

      if (!action.payload) {
        draft.auth.loggedIn = false;
        draft.auth.user = null;
        draft.auth.token = null;
        break;
      }

      draft.offline = false;

      draft.auth.loggedIn = true;
      draft.auth.user = action.payload.user;
      draft.auth.token = action.payload.token;
      break;
    case 'offline':
      draft.offline = true;
      draft.error = null;
      draft.auth.token = null;
      draft.socket.connected = false;
      break;
    case 'error':
      draft.error = action.payload;
      break;
    case 'socketConnected':
      draft.socket.connected = action.payload;
      if (!action.payload) {
        draft.auth.token = null;
      }
      break;
  }
});