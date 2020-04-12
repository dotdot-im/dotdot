import React from 'react'
import randomWords from 'random-words'

import MessageComponent from 'sections/Chat/Messages/Message'
import { Message, User, AppState } from 'store/types'

import 'lib/icons'

import '../assets/scss/index.scss'
import { StateProvider, initialState } from 'store/state'

export default { title: 'Message' }

const users: User[] = [
  {
    user_id: '1',
    color: 'eb0000',
    name: 'test_user_1',
    icon: null,
    isActive: true,
    hasPassword: false,
  },
  {
    user_id: '2',
    color: 'ec7600',
    name: 'test_user_2',
    icon: null,
    isActive: true,
    hasPassword: true,
  },
  {
    user_id: '3',
    color: '38b08c',
    name: 'test_user_3',
    icon: null,
    isActive: true,
    hasPassword: false,
  },
]

const testState: AppState = {
  auth: {
    checked: true,
    loggedIn: true,
    user: users[0],
  },
  socket: {
    connected: true,
  },
  draftTimer: 100,
  messages: [],
  onlineUsers: users,
  stats: initialState.stats,
  offline: false,
  error: null,
};

export const messageByMe = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: users[0],
    attributes: {
      draft: false,
      private: false,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
  );
}

export const messageByOther = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: users[1],
    attributes: {
      draft: false,
      private: false,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
  );
}

export const draft = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: users[1],
    attributes: {
      draft: true,
      private: false,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
  );
}

export const privateMessage = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: '@someone Some random private test message',
    user: users[1],
    attributes: {
      draft: false,
      private: true,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
  );
}

export const privateDraft = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'Some random test message',
    user: users[1],
    attributes: {
      draft: true,
      private: true,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
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
      icon: 'cog',
      isActive: true,
      hasPassword: false,
    },
    attributes: {
      draft: false,
      private: false,
    },
  }

  return (
    <StateProvider state={ testState }>
      <MessageComponent message={testMessage} />
    </StateProvider>
  );
}

export const offlineUser = () => {
  const testMessage: Message = {
    timestamp: new Date(),
    message: 'This came from a user that is now offline',
    user: users[0],
    attributes: {
      draft: false,
      private: false,
    },
  }

  const state: AppState = {
    auth: {
      checked: true,
      loggedIn: true,
      user: users[1],
    },
    socket: {
      connected: true,
    },
    draftTimer: 100,
    messages: [],
    onlineUsers: [users[1]],
    stats: initialState.stats,
    offline: false,
    error: null,
  };

  return (
    <StateProvider state={ state }>
      <MessageComponent message={testMessage} />
    </StateProvider>
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
    <StateProvider state={ testState }>
      {msgs.map((msg) => (
        <MessageComponent key={msg.timestamp.toUTCString()} message={msg} />
      ))}
    </StateProvider>
  )
}
