import { useEffect } from 'react';

import { useStateValue } from '../store/state';
import { fetchResource } from '../util/fetch';

const FAKE_AUTH = false;

function useCheckLogin() {
  const { state, dispatch } = useStateValue();
  const checkedLogin = state.auth.checked;

  useEffect(() => {
    if (!checkedLogin) {
      if (process.env.NODE_ENV === 'development' && FAKE_AUTH) {
        dispatch({
          type: 'login',
          payload: {
            user: {
              uuid: '123456',
              balance: 100,
              currency: 'GBP',
              transferwise_id: 1234,
              created_on: new Date(),
            },
            csrf: '123',
          },
        });
        dispatch({
          type: 'status',
          payload: {
            offline: true,
          },
        })
        return;
      }
      fetchResource('/users/current', 'GET').then(data => {
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