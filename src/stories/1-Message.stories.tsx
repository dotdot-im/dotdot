import React from 'react'

import MessageComponent from 'sections/Chat/Messages/Message'
import { Message, User } from 'store/types'
import { Container } from 'react-bootstrap'

import 'lib/icons'

import 'assets/scss/index.scss'
import { StateProvider } from 'store/state'
import { getInitialState, generateRandomUsers, generateRandomMessage, SYSTEM_USER, generateRandomMessages } from './lib/testData'

export default { title: 'Message' }

const users: User[] = generateRandomUsers(3)
const currentUser: User = users[0]

const testState = getInitialState(users)

function renderMessage(message: Message, state = testState) {
  return (
    <StateProvider state={ state }>
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
