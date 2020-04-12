import produce from 'immer'

import { AppState, Action, Message, EVENTS } from './types'
import { MAX_MESSAGE_HISTORY } from '../constants'
import { MAX_STATS_BARS } from 'sections/Admin'

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
      draft.onlineUsers = action.payload.users
      break
    case 'user_password':
      if (draft.auth.user) {
        draft.auth.user.hasPassword = true
      }
      break
    case `socket_${EVENTS.MESSAGE}`:
      const message: Message = action.payload
      // delete draft from this user
      const existingDraft = draft.messages.findIndex(
        (eachMessage) =>
          eachMessage.attributes.draft &&
          eachMessage.user.user_id === message.user.user_id
      )
      if (existingDraft > -1) {
        draft.messages.splice(existingDraft, 1)
      }

      if (message.message.trim().length < 1) {
        return;
      }

      if (!message.attributes.draft) {
        const lastMessage = draft.messages[draft.messages.length - 1]

        if (lastMessage && lastMessage.user.user_id === message.user.user_id && lastMessage.attributes.private === message.attributes.private) {
          // last message was by this same user (and it's the same kind of message)
          lastMessage.message += `\n${message.message}`
          lastMessage.timestamp = new Date(message.timestamp)
          return
        }
      }

      draft.messages.push({
        timestamp: new Date(message.timestamp),
        attributes: message.attributes,
        message: message.message,
        user: message.user,
      })

      if (draft.messages.length > MAX_MESSAGE_HISTORY) {
        draft.messages.shift()
      }
      break;
    case `socket_${EVENTS.HISTORY}`:
      draft.messages = action.payload.map((eachMessage: Message) => {
        eachMessage.timestamp = new Date(eachMessage.timestamp)
        return eachMessage
      });
      break;
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
      break;
    case `socket_${EVENTS.CONTROL}`:
      Object.keys(action.payload).forEach(key => {
        if (typeof draft[key] !== 'undefined') {
          draft[key] = action.payload[key]
        }
      })
  }
})
