export type User = {
  user_id: string
  name: string
  color: string
  hasPassword: boolean
}

export type Message = {
  user: User
  timestamp: Date
  message: string
  attributes: {
    draft: boolean
    private: boolean
    to?: string | null
  }
}

export type AppState = {
  auth: {
    checked: boolean
    loggedIn: boolean
    user: User | null
  }
  socket: {
    connected: boolean
  }
  onlineUsers: User[]
  offline: boolean
  error: string | null
}

export type Action = {
  type: string
  payload?: any
}

export type AppContext = {
  state: AppState
  dispatch: React.Dispatch<Action>
}

export type AuthData = {
  user: User
  token: string
}
