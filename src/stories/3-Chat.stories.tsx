import React, { useRef, useEffect } from 'react'

import Chat from '../sections/Chat'
import { User, IncomingMessage } from '../store/types'

import '../lib/icons'

import '../assets/scss/index.scss'
import useGlobalState, { StateProvider } from 'store/state'
import { getInitialState, generateRandomUsers, generateRandomMessages, getRandomUser, generateRandomIncomingMessage } from './lib/testData'

export default { title: 'Chat' }

const users: User[] = generateRandomUsers(10)

const testState = getInitialState(users)
testState.messages = generateRandomMessages(20, users, true)

export const chat = () => {
  return (
    <StateProvider state={ testState }>
      <Chat />
    </StateProvider>
  );
}

const AutomatedChat = () => {
  const { state, dispatch } = useGlobalState()

  const interval = useRef<any>(null)

  useEffect(() => {
    interval.current = setInterval(() => {
      const message: IncomingMessage = generateRandomIncomingMessage(getRandomUser(state.onlineUsers), state.messages)
      message.content = 'New Message: ' + (new Date()).toLocaleTimeString() + '\n' + message.content

      dispatch({
        type: 'socket_message',
        payload: message,
      })
    }, Math.random() * 3000 + 1000)

    return () => {
      clearInterval(interval.current)
    }
  }, [])

  return (
    <Chat />
  );
}

export const ScrollingChat = () => {
  const state = getInitialState(users)
  state.messages = generateRandomMessages(20, users, true)

  return (
    <StateProvider state={ state }>
      <AutomatedChat />
    </StateProvider>
  );
}