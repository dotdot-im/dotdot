import produce from 'immer'

import { AppState, Action, Message } from './types'
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
    case 'socketConnected':
      draft.socket.connected = action.payload
      draft.offline = !action.payload
      draft.error = null
      break
    case 'onlineUsers':
      draft.onlineUsers = action.payload
      break
    case 'user_password':
      if (draft.auth.user) {
        draft.auth.user.hasPassword = true
      }
      break
    case 'message':
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
    case 'history':
      draft.messages = action.payload.map((eachMessage: Message) => {
        eachMessage.timestamp = new Date(eachMessage.timestamp)
        return eachMessage
      });
      break;
    case 'stats':
      draft.stats.messages.push(action.payload.messages)
      if (draft.stats.messages.length > MAX_STATS_BARS) {
        draft.stats.messages.shift()
      }

      draft.stats.users.push(action.payload.users)
      if (draft.stats.users.length > MAX_STATS_BARS) {
        draft.stats.users.shift()
      }

      draft.stats.rooms = action.payload.rooms
      break;
  }
})
