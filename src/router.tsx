import React, { useEffect } from "react";
import { Switch } from "react-router-dom";

import Chat from "sections/Chat";
import AuthenticatedRoute from "util/AuthenticatedRoute";
import UnauthenticatedRoute from "util/UnauthenticatedRoute";
import OfflineCheck from "components/OfflineCheck";
import Login from "sections/Login";
import useGlobalState from "store/state";
import checkAuth from "util/checkAuth";


export default () => {
  const { state, dispatch } = useGlobalState();

  // Check authentication state
  useEffect(() => {
    if (!state.auth.checked || !state.auth.token) {
      checkAuth(dispatch);
    };
  }, [state.auth.checked, state.auth.token, dispatch]);

  return (
    <>
      <OfflineCheck />
      <Switch>
        <UnauthenticatedRoute path='/login' component={ Login } />
        <AuthenticatedRoute path="/" component={ Chat } />
      </Switch>
    </>
  );
};
