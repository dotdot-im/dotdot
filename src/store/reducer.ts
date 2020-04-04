import produce from "immer"

import { AppState, Action } from "./types";

// TODO NEW BLOG POST
// const REDUCER = {
//   [REDUX_CONSTANTS.LOGIN]: (draft, payload) => {},
// };

export default produce((draft: AppState, action: Action) => {
  // REDUCER[action.type](draft, action.payload);

  switch (action.type) {
    case 'login':
      draft.auth.checked = true;
      draft.error = null;
      draft.offline = false;

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
      draft.error = null;
      break;
    case 'error':
      draft.error = action.payload;
      break;
    case 'socketConnected':
      draft.connected = action.payload;
      if (!action.payload) {
        draft.auth.checked = false;
      }
      break;
  }
});