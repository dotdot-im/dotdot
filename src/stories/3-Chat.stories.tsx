import React from 'react'

import Chat from '../sections/Chat'
import { User } from '../store/types'

import '../lib/icons'

import '../assets/scss/index.scss'
import { StateProvider } from 'store/state'
import { getInitialState, generateRandomUsers, generateRandomMessages } from './lib/testData'

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