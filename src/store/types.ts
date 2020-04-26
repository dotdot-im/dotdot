import { IconName } from '@fortawesome/fontawesome-svg-core'

export type User = {
  user_id: string
  name: string
  color: string
  contrastColor?: string
  icon: IconName | null
  isActive: boolean
  isAdmin?: boolean
  hasPassword: boolean
}

export type MessageAttributes = {
  draft: boolean
  private: boolean
  to?: string | null
  replyToId?: string | null
  replyTo?: Message | null
}

export type Message = {
  uuid: string
  user: User
  timestamp: Date
  content: string[]
  attributes: MessageAttributes
}

export type IncomingMessage = {
  uuid: string
  user: User
  timestamp: Date
  content: string
  attributes: MessageAttributes
}

export type OutgoingMessage = {
  content: string
  attributes: MessageAttributes
}

export type RoomStats = {
  id: string
  active: number
  inactive: number
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
  draftTimer: number
  onlineUsers: User[]
  messages: Message[]
  stats: {
    messages: number[]
    users: number[]
    rooms: RoomStats[]
    onlineUsers: number
    totalMessages: number
    totalUsers: number
    cpuUsage: number
    freeMemory: number
    uptime: number
    timeActive: number
    timeInactive: number
    sessions: number
  }
  offline: boolean
  error: string | null
  chat: {
    focused: boolean
  }

  [key: string]: any
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

export const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  COMMAND: 'command',
  HISTORY: 'history',
  ONLINE_USERS: 'users',
  STATS: 'stats',
  TIMER: 'timer',
  CONTROL: 'control',
  CHANGE_ROOM: 'change_room',
}
