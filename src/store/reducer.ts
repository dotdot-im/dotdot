import produce from "immer"

import { AppState, Action } from "./types";

export default produce((draft: AppState, action: Action) => {
  console.info('REDUCER: ', action.type);
  console.log(action.payload);
  switch (action.type) {
    case 'login':
      draft.auth.checked = true;

      if (!action.payload) {
        break;
      }

      draft.auth.loggedIn = true;
      draft.auth.user = action.payload.user;
      draft.auth.token = action.payload.token;
      break;
  }
});