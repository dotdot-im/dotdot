import React from 'react'

import reducer from './reducer'
import { AppState, AppContext, Action } from './types'
import { MAX_STATS_BARS } from 'sections/Admin'

export const initialState: AppState = {
  auth: {
    checked: false,
    loggedIn: false,
    user: null,
  },
  socket: {
    connected: false,
  },
  draftTimer: 100,
  onlineUsers: [],
  messages: [],
  stats: {
    messages: new Array(MAX_STATS_BARS).fill(0),
    users: new Array(MAX_STATS_BARS).fill(0),
    rooms: [],
    onlineUsers: 0,
    totalUsers: 0,
    totalMessages: 0,
    cpuUsage: 0,
    freeMemory: 0,
    uptime: 0,
    timeActive: 0,
    timeInactive: 0,
    sessions: 1,
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
  state?: AppState,
  children: any
}

export const StateProvider = (props: Props) => {
  const [state, dispatch] = React.useReducer(reducer, props.state || initialState)
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
