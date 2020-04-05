import React from "react";
import { Switch } from "react-router-dom";

import Chat from "sections/Chat";
import AuthenticatedRoute from "util/AuthenticatedRoute";
import UnauthenticatedRoute from "util/UnauthenticatedRoute";
import OfflineCheck from "components/OfflineCheck";
import Login from "sections/Login";
import useGlobalState from "store/state";
import { fetchResource } from "util/fetch";
import { AuthData } from "store/types";

export default () => {
  const { state, dispatch } = useGlobalState();

  if (!state.auth.checked) {
    fetchResource('/auth', 'GET').then((data: AuthData) => {
      if (!data || !data.user.user_id) {
        console.warn('Invalid user object');
        dispatch({
          type: 'login',
          payload: null,
        })
        return;
      }

      dispatch({
        type: 'login',
        payload: data,
      })
    }).catch(reason => {
      console.log('Login check failed', reason);
      dispatch({
        type: 'error',
        payload: reason.errors.join(', '),
      })

      dispatch({
        type: 'login',
        payload: null,
      })
    });
  };

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
