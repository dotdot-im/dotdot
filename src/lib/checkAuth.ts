import { useEffect } from 'react';

import { useStateValue } from '../store/state';
import { fetchResource } from '../util/fetch';

function useCheckLogin() {
  const { state, dispatch } = useStateValue();
  const checkedLogin = state.auth.checked;

  useEffect(() => {
    if (!checkedLogin) {
      fetchResource('/auth', 'GET').then(data => {
        if (!data || !data.user.uuid) {
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
        dispatch({
          type: 'login',
          payload: null,
        })
      });
    }
  }, [checkedLogin, dispatch]);
}


export default useCheckLogin;