import React from 'react'

import MessageComponent from 'sections/Chat/Messages/Message'
import { Message, User } from 'store/types'
import { Container } from 'react-bootstrap'

import 'lib/icons'

import 'assets/scss/index.scss'
import { StateProvider } from 'store/state'
import {
  getInitialState,
  generateRandomUsers,
  generateRandomMessage,
  SYSTEM_USER,
  TIMED_CONTENT_TEST,
  TIMED_CONTENT_DELETE_TEST,
} from './lib/testData'

export default { title: 'Message' }

const users: User[] = generateRandomUsers(3)
const currentUser: User = users[0]

const testState = getInitialState(users)

function renderMessage(message: Message, state = testState) {
  return (
    <StateProvider state={state}>
      <Container>
        <MessageComponent message={message} />
      </Container>
    </StateProvider>
  )
}

export const messageByMe = () => {
  const testMessage = generateRandomMessage(currentUser, [])

  return renderMessage(testMessage)
}

export const messageByOther = () => {
  const testMessage = generateRandomMessage(users[1], [])

  return renderMessage(testMessage)
}

export const draft = () => {
  const testMessage = generateRandomMessage(users[1], [])
  testMessage.attributes.draft = true

  return renderMessage(testMessage)
}

export const privateMessage = () => {
  const testMessage = generateRandomMessage(users[1], [])
  testMessage.attributes.private = true

  return renderMessage(testMessage)
}

export const privateDraft = () => {
  const testMessage = generateRandomMessage(users[1], [])
  testMessage.attributes.draft = true
  testMessage.attributes.private = true

  return renderMessage(testMessage)
}

export const systemMessage = () => {
  const testMessage = generateRandomMessage(SYSTEM_USER, [])

  return renderMessage(testMessage)
}

export const offlineUser = () => {
  const testMessage = generateRandomMessage(currentUser, [])
  const state = getInitialState([])

  return renderMessage(testMessage, state)
}

export const timedDraft = () => {
  const testMessage = generateRandomMessage(currentUser, [])

  testMessage.attributes.draft = true
  testMessage.attributes.private = false
  testMessage.content[0] = 'Hey man, this is a message with timed characters.'
  testMessage.timedContent = TIMED_CONTENT_TEST

  return renderMessage(testMessage, testState)
}

export const timedDraftDelete = () => {
  const testMessage = generateRandomMessage(currentUser, [])

  testMessage.attributes.draft = true
  testMessage.attributes.private = false
  testMessage.content[0] = 'let\'s try changing a chunk'
  testMessage.timedContent = TIMED_CONTENT_DELETE_TEST

  return renderMessage(testMessage, testState)
}
