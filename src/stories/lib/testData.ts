import randomWords from 'random-words'

import { Message, User, AppState, MessageAttributes } from '../../store/types'
import { initialState } from '../../store/state';
import { TimedChange } from 'sections/Chat/TextBox';

export const SYSTEM_USER: User = {
  user_id: 'dotdot',
  color: 'ff5151',
  name: 'dotdot',
  icon: 'cog',
  isActive: true,
  hasPassword: false,
}

export function getInitialState(users: User[], currentUser?: User): AppState {
  const state = JSON.parse(JSON.stringify(initialState))

  state.onlineUsers = users
  state.auth = {
    checked: true,
    loggedIn: true,
    user: currentUser || users[0],
  }
  state.socket.connected = true

  return state
}

export function generateRandomUsers(num: number): User[] {
  return Array.from(Array(num)).map(generateRandomUser)
}

export function generateRandomUser(): User {
  const name = randomWords(1)
  const color = Math.floor(Math.random() * 16777215).toString(16);
  return {
    user_id: '' + Math.floor(Math.random() * 100000),
    color,
    name,
    icon: null,
    isActive: true,
    hasPassword: false,
  }
}

export function generateRandomMessages(num: number, users: User[], randomAttributes: boolean = false): Message[] {
  const messages: Message[] = []

  Array.from(Array(num)).forEach(() => {
    const user = users[Math.floor(Math.random() * users.length)]
    messages.push(generateRandomMessage(user, messages, randomAttributes))
  })

  return messages
}

export function generateRandomMessageContent(): string {
  return randomWords(Math.round(3 + Math.random() * 100)).join(' ')
}

export function generateRandomMessage(user: User, messages: Message[], randomAttributes: boolean = false): Message {
  let timestamp = new Date()

  if (messages.length > 0) {
    // grab a random date before the last one
    const lastDate = messages[messages.length - 1].timestamp
    const pastDrift = 1000 * Math.floor(Math.random() * 60 * 3) // up to 3 minutes
    timestamp = new Date(+lastDate + pastDrift)
  }

  const attributes: MessageAttributes = {
    draft: false,
    private: false,
    replyToTimestamp: null,
  }

  if (randomAttributes) {
    if (messages.length > 0 && Math.random() < 0.2) {
      attributes.replyTo = messages[Math.floor(Math.random() * messages.length)]
      attributes.replyToTimestamp = attributes.replyTo.timestamp.getTime()
    }

    attributes.draft = Math.random() < 0.3
    attributes.private = Math.random() < 0.1
  }

  let content = [
    generateRandomMessageContent()
  ]
  if (Math.random() > 0.7) {
    let contentLength = Math.floor(Math.random() * 5)
    for (let i = 0; i < contentLength; i++) {
      content.push(generateRandomMessageContent())
    }
  }

  return {
    timestamp,
    user,
    attributes,
    content,
  }
}

export const TIMED_CONTENT_TEST: TimedChange[] = [
  [0, 'h', 0],
  [1, 'e', 86],
  [2, 'y', 146],
  [3, ' ', 13],
  [4, 'm', 244],
  [5, 'm', 107],
  [6, 'n', 316],
  [6, null, 356],
  [5, null, 577],
  [5, 'a', 261],
  [6, 'n', 131],
  [7, ',', 369],
  [8, ' ', 32],
  [9, 't', 302],
  [10, 'h', 95],
  [11, 'i', 35],
  [12, 's', 132],
  [13, ' ', 103],
  [14, 'i', 142],
  [15, 's', 97],
  [16, ' ', 75],
  [17, 'a', 124],
  [18, ' ', 64],
  [19, 'm', 153],
  [20, 'e', 87],
  [21, 's', 154],
  [22, 's', 157],
  [23, 'a', 156],
  [24, 'g', 245],
  [25, 'e', 51],
  [26, ' ', 274],
  [27, 'w', 100],
  [28, 'i', 169],
  [29, 't', 151],
  [30, 'h', 117],
  [31, ' ', 84],
  [32, 'i', 829],
  [33, 'n', 202],
  [34, 'f', 295],
  [35, 'o', 135],
  [36, 'r', 84],
  [37, 'm', 73],
  [38, 'a', 135],
  [39, 't', 168],
  [40, 'i', 81],
  [41, 'o', 36],
  [42, 'n', 60],
  [32, ' ', 2816],
  [32, 't', 263],
  [33, 'i', 91],
  [34, 'm', 118],
  [35, 'e', 95],
  [36, 'd', 125],
  [48, null, 1947],
  [47, null, 134],
  [46, null, 116],
  [45, null, 126],
  [44, null, 129],
  [43, null, 123],
  [42, null, 134],
  [41, null, 117],
  [40, null, 142],
  [39, null, 282],
  [38, null, 232],
  [38, 'c', 360],
  [39, 'h', 216],
  [40, 'a', 142],
  [41, 'r', 477],
  [42, 'a', 192],
  [43, 'c', 116],
  [44, 't', 237],
  [45, 'e', 171],
  [46, 'r', 71],
  [47, 's', 198],
  [48, '.', 790],
  [0, null, 2938],
  [0, 'H', 309],
]