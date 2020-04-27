import randomWords from 'random-words'
import { v4 as uuidv4 } from 'uuid'

import { Message, User, AppState, MessageAttributes, IncomingMessage } from '../../store/types'
import { initialState } from '../../store/state';

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

export function getRandomUser(users: User[]): User {
  return users[Math.floor(Math.random() * users.length)]
}

export function generateRandomMessages(num: number, users: User[], randomAttributes: boolean = false): Message[] {
  const messages: Message[] = []

  Array.from(Array(num)).forEach(() => {
    const user = getRandomUser(users)
    messages.push(generateRandomMessage(user, messages, randomAttributes))
  })

  return messages
}

export function generateRandomMessageContent(): string {
  return randomWords(Math.round(3 + Math.random() * 100)).join(' ')
}

export function generateRandomIncomingMessage(user: User, messages: Message[], randomAttributes: boolean = false): IncomingMessage {
  const message: any = generateRandomMessage(user, messages, randomAttributes)
  message.content = message.content[0]
  message.timestamp = new Date()
  return message
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
    replyToId: null,
  }

  if (randomAttributes) {
    if (messages.length > 0 && Math.random() < 0.2) {
      attributes.replyTo = messages[Math.floor(Math.random() * messages.length)]
      attributes.replyToId = attributes.replyTo.uuid
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
    uuid: uuidv4(),
    timestamp,
    user,
    attributes,
    content,
  }
}