import React from 'react'

import reducer from './reducer'
import { AppState, AppContext, Action } from './types'

const initialState: AppState = {
  auth: {
    checked: false,
    loggedIn: false,
    user: null,
    token: null,
  },
  socket: {
    connected: false,
    key: null,
  },
  offline: false,
  error: null,
}
const defaultDispatch: React.Dispatch<Action> = () => {
  console.warn('Using default reducer, check StateProvider')
  return initialState
}
export const StateContext = React.createContext<AppContext>({
  state: initialState,
  dispatch: defaultDispatch,
})

type Props = {
  children: any
}

export const StateProvider = (props: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // TODO: if value is not "any" then typescript has an issue with readonly state values
  const value: any = { state, dispatch }
  return (
    <StateContext.Provider value={value}>
      {props.children}
    </StateContext.Provider>
  )
}

export const useGlobalState = (): AppContext => React.useContext(StateContext)
export default useGlobalState
