import React, { useContext, useRef } from 'react'
import { Container } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { useImmer } from 'use-immer'

import { SocketContext } from 'util/socketProvider'
import styles from './index.module.scss'
import { User } from 'store/types'
import { VALID_USERNAME } from '../../../constants'

type State = {
  message: string,
  private: boolean,
  to: User | null,
}

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
    private: false,
    to: null,
  })
  const draftTimer = useRef<any>(null)

  const { socket } = useContext(SocketContext)

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault()

    if (state.message.length < 1 || state.message.trim().length < 1) {
      return
    }

    setState((draft) => {
      draft.message = ''
    })

    sendMessage();
  }

  const sendMessage = (draft: boolean = false) => {
    if (state.message.length < 1 || state.message.trim().length < 1) {
      return
    }
    socket?.emit('message', {
      message: state.message,
      attributes: {
        draft,
        private: state.private
      },
    })
  }

  const onType = (e: React.ChangeEvent<any>) => {
    e.preventDefault()

    clearTimeout(draftTimer.current)

    const value: string = e.currentTarget.value

    // is it a PM?
    let isPM = false;
    const words = value.split(' ')
    if (words.length > 0 && words[0][0] === '@' && VALID_USERNAME.test(words[0].substr(1))) {
      isPM = true;
    }

    setState((draft) => {
      draft.message = value
      draft.private = isPM
    })

    draftTimer.current = setTimeout(() => {
      sendMessage(true)
    }, 100)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} className={styles.textBox}>
      <Form.Group controlId="chatForm.message">
        <Container>
          <Form.Control
            as="input"
            type="text"
            placeholder="Type a message..."
            autoFocus
            onChange={onType}
            value={state.message}
          />
        </Container>
      </Form.Group>
    </Form>
  )
}
