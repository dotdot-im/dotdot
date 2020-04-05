export type User = {
  user_id: string,
  name: string,
  color: string,
};

export type Message = {
  id: number,
  message: string,
  user: User,
};

export type AppState = {
  auth: {
    checked: boolean,
    loggedIn: boolean,
    user: User | null,
    token: string | null,
  },
  socket: {
    connected: boolean,
    key: CryptoKey | null,
  },
  offline: boolean,
  error: string | null,
};

export type Action = {
  type: string,
  payload?: any,
};

export type AppContext = {
  state: AppState,
  dispatch: React.Dispatch<Action>,
};

export type AuthData = {
  user: User,
  token: string,
};