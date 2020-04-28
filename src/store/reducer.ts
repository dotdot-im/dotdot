import produce from 'immer'
import { v4 as uuidv4 } from 'uuid'

import {
  AppState,
  Action,
  Message,
  EVENTS,
  User,
  IncomingMessage,
} from './types'
import { MAX_MESSAGE_HISTORY } from '../constants'
import { MAX_STATS_BARS } from 'sections/Admin'
import { makeColorReadable } from 'lib/color/makeColorReadable'

// TODO NEW BLOG POST
// const REDUCER = {
//   [REDUX_CONSTANTS.LOGIN]: (draft, payload) => {},
// };

export default produce((draft: AppState, action: Action) => {
  // REDUCER[action.type](draft, action.payload);
  // console.log('REDUCER', action)

  switch (action.type) {
    case 'login':
      if (!draft.offline) {
        draft.auth.checked = true
      }

      if (!action.payload) {
        draft.auth.loggedIn = false
        draft.auth.user = null
        break
      }

      draft.offline = false

      draft.auth.loggedIn = true
      draft.auth.user = action.payload.user
      break
    case 'offline':
      draft.offline = true
      draft.error = null
      draft.socket.connected = false
      break
    case 'error':
      draft.error = action.payload
      break
    case 'user_password':
      if (draft.auth.user) {
        draft.auth.user.hasPassword = true
      }
      break
    case 'system_message':
      const systemMessage = {
        uuid: uuidv4(),
        user: systemUser,
        content: [action.payload],
        timestamp: new Date(),
        attributes: {
          private: false,
          draft: false,
        },
      }
      draft.messages.push(systemMessage)
      break
    case `socket_${EVENTS.CONNECT}`:
      draft.socket.connected = true
      draft.offline = false
      draft.error = null
      break
    case `socket_${EVENTS.DISCONNECT}`:
      draft.socket.connected = false
      draft.offline = true
      draft.error = null
      break
    case `socket_${EVENTS.ONLINE_USERS}`:
      draft.onlineUsers = action.payload.users.map((user: User) => {
        user.contrastColor = makeColorReadable('#' + user.color)
        return user
      })
      break
    case `socket_${EVENTS.MESSAGE}`:
      const incomingMessage: IncomingMessage = action.payload
      incomingMessage.timestamp = new Date(incomingMessage.timestamp)

      // delete draft from this user, and if the draft is past messages, keep it there
      // this way if multiple users are typing, their drafts don't keep jumping around
      let draftIsPastMessage = false;
      let draftIndex = -1;
      for (let i = draft.messages.length - 1; i >= 0; i--) {
        const eachMessage = draft.messages[i]
        if (!eachMessage.attributes.draft) {
          draftIsPastMessage = true
        }
        if (
          eachMessage.attributes.draft &&
          eachMessage.user.user_id === incomingMessage.user.user_id
        ) {
          draftIndex = i
          break
        }
      }

      const isEmpty = incomingMessage.content.trim().length < 1

      if (draftIndex > -1) {
        if (draftIsPastMessage || !incomingMessage.attributes.draft) {
          draft.messages.splice(draftIndex, 1)
        } else if (!isEmpty && incomingMessage.attributes.draft) {
          draft.messages[draftIndex].content[0] = incomingMessage.content
          draft.messages[draftIndex].timedContent = incomingMessage.timedContent
          draft.messages[draftIndex].timestamp = new Date(
            incomingMessage.timestamp
          )
          return
        }
      }

      if (isEmpty) {
        return
      }

      if (incomingMessage.attributes.replyToId) {
        const messageReply =
          draft.messages.find(
            (eachMessage) =>
              eachMessage.uuid ===
              incomingMessage.attributes.replyToId
          ) || null
        if (messageReply && messageReply.user) {
          incomingMessage.attributes.replyTo = messageReply
        }
      }

      if (!incomingMessage.attributes.draft) {
        const lastMessage = draft.messages[draft.messages.length - 1]

        if (
          lastMessage &&
          lastMessage.user.user_id === incomingMessage.user.user_id &&
          lastMessage.attributes.private ===
            incomingMessage.attributes.private &&
          lastMessage.attributes.replyToId ===
            incomingMessage.attributes.replyToId
        ) {
          // last message was by this same user (and it's the same kind of message)
          lastMessage.content.push(incomingMessage.content)
          lastMessage.timestamp = new Date(incomingMessage.timestamp)
          return
        }
      }

      const message: Message = {
        uuid: incomingMessage.uuid,
        user: incomingMessage.user,
        timestamp: incomingMessage.timestamp,
        attributes: incomingMessage.attributes,
        content: [incomingMessage.content],
      }

      if (incomingMessage.attributes.draft) {
        message.timedContent = incomingMessage.timedContent
      }

      draft.messages.push(message)

      if (draft.messages.length > MAX_MESSAGE_HISTORY) {
        draft.messages.shift()
      }
      break
    case `socket_${EVENTS.HISTORY}`:
      draft.messages = action.payload.map((eachMessage: Message) => {
        eachMessage.timestamp = new Date(eachMessage.timestamp)
        return eachMessage
      })
      break
    case `socket_${EVENTS.STATS}`:
      draft.stats.messages.push(action.payload.messages)
      if (draft.stats.messages.length > MAX_STATS_BARS) {
        draft.stats.messages.shift()
      }

      draft.stats.users.push(action.payload.users)
      if (draft.stats.users.length > MAX_STATS_BARS) {
        draft.stats.users.shift()
      }

      draft.stats.rooms = action.payload.rooms
      draft.stats.onlineUsers = action.payload.users
      draft.stats.totalUsers = action.payload.totalUsers
      draft.stats.totalMessages = action.payload.totalMessages
      draft.stats.cpuUsage = Math.round(action.payload.cpuUsage * 100)
      draft.stats.freeMemory = Math.round(action.payload.freeMemory * 100)
      draft.stats.uptime = Math.round(action.payload.uptime)
      draft.stats.timeActive = action.payload.timeActive * 30
      draft.stats.timeInactive = action.payload.timeInactive * 30
      draft.stats.sessions = action.payload.sessions
      break
    case `socket_${EVENTS.CONTROL}`:
      Object.keys(action.payload).forEach((key) => {
        if (typeof draft[key] !== 'undefined') {
          draft[key] = action.payload[key]
        }
      })
      break
    case 'chat_focus':
      draft.chat.focused = action.payload
      break
  }
})

const systemUser: User = {
  user_id: 'dotdot',
  name: 'dotdot',
  icon: 'cog',
  color: 'f75f00',
  isActive: true,
  hasPassword: true,
}
