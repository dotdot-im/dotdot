export type User = {
  uuid: string,
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
  offline: boolean,
  connected: boolean,
  error: string | null,
  messages: Message[],
  users: User[],
};

export type Action = {
  type: string,
  payload?: any,
};

export type AppContext = {
  state: AppState,
  dispatch: React.Dispatch<Action>,
};