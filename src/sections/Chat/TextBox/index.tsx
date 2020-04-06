import React, { useContext, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import { SocketContext } from 'util/socketProvider'
import styles from './index.module.scss'
import { User } from 'store/types'
import { VALID_USERNAME } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

    sendMessage(state.message);

    setState((draft) => {
      draft.message = ''
      draft.private = false
    })
  }

  const sendMessage = (message: string, draft: boolean = false) => {
    if (message.length < 1 || message.trim().length < 1) {
      return
    }
    socket?.emit('message', {
      message,
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
      sendMessage(value, true)
    }, 100)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} className={ classNames('container', styles.textBox, { [styles.private]: state.private }) }>
      <Form.Group controlId="chatForm.message">
        <Form.Control
          as="input"
          type="text"
          placeholder="Type a message..."
          autoFocus
          onChange={onType}
          value={state.message}
        />
        <span>
          <FontAwesomeIcon icon='lock' />
        </span>
      </Form.Group>
    </Form>
  )
}
