import produce from 'immer'

import { AppState, Action, Message, EVENTS, User } from './types'
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
        user: systemUser,
        message: action.payload,
        timestamp: new Date(),
        attributes: {
          private: false,
          draft: false,
        }
      };
      draft.messages.push(systemMessage)
      break;
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
      const msgObject: Message = {
        timestamp: new Date(action.payload.timestamp),
        attributes: { ...action.payload.attributes },
        message: action.payload.message,
        user: action.payload.user,
      }

      // delete draft from this user, and if the draft is past messages, stay there
      let draftIsPastMessage = false;
      let draftIndex = -1;
      for (let i = draft.messages.length - 1; i >= 0; i--) {
        const eachMessage = draft.messages[i]
        if (!eachMessage.attributes.draft) {
          draftIsPastMessage = true
        }
        if (eachMessage.attributes.draft && eachMessage.user.user_id === msgObject.user.user_id) {
          draftIndex = i;
          break;
        }
      }

      const isEmpty = msgObject.message.trim().length < 1

      if (draftIndex > -1) {
        if (draftIsPastMessage || !msgObject.attributes.draft) {
          draft.messages.splice(draftIndex, 1)
        } else if (!isEmpty && msgObject.attributes.draft) {
          draft.messages[draftIndex].message = msgObject.message
          draft.messages[draftIndex].timestamp = new Date(msgObject.timestamp)
          return;
        }
      }

      if (isEmpty) {
        return;
      }

      if (action.payload.attributes.replyTo) {
        const messageReply = draft.messages.find(eachMessage => eachMessage.timestamp.getTime() === action.payload.attributes.replyTo) || null
        if (messageReply && messageReply.user) {
          msgObject.attributes.replyTo = messageReply
        }
        msgObject.attributes.replyToTimestamp = action.payload.attributes.replyTo
      }

      if (!msgObject.attributes.draft) {
        const lastMessage = draft.messages[draft.messages.length - 1]

        if (
            lastMessage &&
            lastMessage.user.user_id === msgObject.user.user_id &&
            lastMessage.attributes.private === msgObject.attributes.private &&
            lastMessage.attributes.replyToTimestamp === msgObject.attributes.replyToTimestamp
          ) {
          // last message was by this same user (and it's the same kind of message)
          lastMessage.message += `\n${msgObject.message}`
          lastMessage.timestamp = new Date(msgObject.timestamp)
          return
        }
      }

      draft.messages.push(msgObject)

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
      draft.stats.timeActive = action.payload.timeActive * 30
      draft.stats.timeInactive = action.payload.timeInactive * 30
      draft.stats.sessions = action.payload.sessions
      break;
    case `socket_${EVENTS.CONTROL}`:
      Object.keys(action.payload).forEach(key => {
        if (typeof draft[key] !== 'undefined') {
          draft[key] = action.payload[key]
        }
      })
  }
})

const systemUser: User = {
  user_id: 'dotdot',
  name: 'dotdot',
  icon: 'cog',
  color: 'f75f00',
  isActive: true,
  hasPassword: true,
};