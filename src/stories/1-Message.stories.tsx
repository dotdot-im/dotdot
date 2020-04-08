import React from 'react'
import randomWords from 'random-words'

import MessageComponent from 'sections/Chat/Messages/Message'
import { Message, User } from 'store/types'

import 'lib/icons'

import '../assets/scss/index.scss'

export default { title: 'Message' }

const users: User[] = [
  {
    user_id: '1',
    color: 'eb0000',
    name: 'alex',
    hasPassword: false,
  },
  {
    user_id: '2',
    color: 'ec7600',
    name: 'phil',
    hasPassword: true,
  },
  {
    user_id: '3',
    color: '38b08c',
    name: 'jaime',
    hasPassword: false,
  },
]

export const normal = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: {
      user_id: '123',
      color: 'eb0000',
      name: 'Test User',
      hasPassword: false,
    },
    attributes: {
      draft: false,
      private: false,
    },
  }

  return (
    <MessageComponent message={testMessage} />
  );
}

export const draft = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: {
      user_id: '123',
      color: 'eb0000',
      name: 'Test User',
      hasPassword: false,
    },
    attributes: {
      draft: true,
      private: false,
    },
  }

  return (
    <MessageComponent message={testMessage} />
  );
}

export const privateMessage = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: {
      user_id: '123',
      color: 'eb0000',
      name: 'Test User',
      hasPassword: false,
    },
    attributes: {
      draft: false,
      private: true,
    },
  }

  return (
    <MessageComponent message={testMessage} />
  );
}

export const privateDraft = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: {
      user_id: '123',
      color: 'eb0000',
      name: 'Test User',
      hasPassword: false,
    },
    attributes: {
      draft: true,
      private: true,
    },
  }

  return (
    <MessageComponent message={testMessage} />
  );
}

export const systemMessage = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'This came from the system',
    user: {
      user_id: 'dotdot',
      color: 'eb0000',
      name: 'dotdot',
      hasPassword: false,
    },
    attributes: {
      draft: false,
      private: false,
    },
  }

  return (
    <MessageComponent message={testMessage} />
  );
}

export const multiple = () => {
  const msgs: Message[] = []
  for (let i = 0; i < 10; i++) {
    const user = Math.round(Math.random() * (users.length - 1))
    msgs.push({
      timestamp: new Date(),
      user: users[user],
      attributes: {
        draft: Math.random() > 0.7,
        private: Math.random() < 0.1,
      },
      message: randomWords(Math.round(3 + Math.random() * 100)).join(' '),
    })
  }

  return (
    <>
      {msgs.map((msg) => (
        <MessageComponent key={msg.timestamp.toUTCString()} message={msg} />
      ))}
    </>
  )
}
