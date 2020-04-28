import { Action, AuthData } from 'store/types'

import { fetchResource } from './fetch'

const OFFLINE_RETRY_DELAY = 2000

export const checkAuth = (dispatch: React.Dispatch<Action>) => {
  fetchResource('/auth', 'GET')
    .then((data: AuthData) => {
      if (!data || !data.user.user_id) {
        console.warn('Invalid user object')
        dispatch({
          type: 'login',
          payload: null,
        })
        return
      }

      dispatch({
        type: 'login',
        payload: data,
      })
    })
    .catch((reason) => {
      if (reason.message === 'Network Error' || reason.message === 'offline') {
        dispatch({
          type: 'offline',
          payload: null,
        })

        // try again
        setTimeout(() => {
          checkAuth(dispatch)
        }, OFFLINE_RETRY_DELAY)
      } else {
        if (reason.status !== 401) {
          dispatch({
            type: 'error',
            payload: reason.errors.join(', '),
          })
        }

        dispatch({
          type: 'login',
          payload: null,
        })
      }
    })
}

export default checkAuth
