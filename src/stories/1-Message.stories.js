import React from 'react'
import randomWords from 'random-words'

import Message from 'sections/Chat/Messages/Message'
import '../assets/scss/index.scss'
import { Container } from 'react-bootstrap'

export default { title: 'Message' }

/*

1. name
2. get cookie -> name in backend

3. never come back -> user inactive for > X time
4. get option to set pwd to keep username

login: name (if new, done. if pwd, prompt)


*/

const users = [
  {
    user_id: '1',
    color: 'eb0000',
    name: 'alex',
  },
  {
    user_id: '2',
    color: 'ec7600',
    name: 'phil',
  },
  {
    user_id: '3',
    color: '38b08c',
    name: 'jaime',
  },
]

export const single = () => {
  const msg = {
    id: 1,
    user: {
      user_id: '123',
      color: 'eb0000',
      name: 'Test User',
    },
    message: 'Some random test message',
  }
  return <Message message={msg} />
}

export const multiple = () => {
  const msgs = []
  for (let i = 0; i < 10; i++) {
    const user = Math.round(Math.random() * (users.length - 1))
    msgs.push({
      id: i + 1,
      user: users[user],
      message: randomWords(Math.round(3 + Math.random() * 100)).join(' '),
    })
  }

  return (
    <Container>
      {msgs.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </Container>
  )
}
