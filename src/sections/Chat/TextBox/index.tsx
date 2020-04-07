import React, { useContext, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import { SocketContext } from 'util/socketProvider'
import styles from './index.module.scss'
import { VALID_USERNAME } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type State = {
  message: string,
  private: boolean,
  to: string | null,
  isCommand: boolean,
}

export default () => {
  const [state, setState] = useImmer<State>({
    message: '',
    private: false,
    to: null,
    isCommand: false,
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
      draft.isCommand = false
    })
  }

  const sendMessage = (message: string, draft: boolean = false) => {
    if (!draft && (message.length < 1 || message.trim().length < 1)) {
      return
    }
    let type = 'message'
    if (state.isCommand) {
      type = 'command'
    }
    socket?.emit(type, {
      message,
      attributes: {
        draft,
        private: state.private,
        to: state.to,
      },
    })
  }

  const onType = (e: React.ChangeEvent<any>) => {
    e.preventDefault()

    clearTimeout(draftTimer.current)

    const value: string = e.currentTarget.value

    // special messages
    let isCommand = false;
    let isPM = false;
    let to: string | null = null;

    if (value[0] === '/') {
      isCommand = true;
    } else {
      const words = value.split(' ')
      if (words.length > 0 && words[0][0] === '@' && VALID_USERNAME.test(words[0].substr(1))) {
        isPM = true;
        to = words[0].substr(1);
      }
    }

    setState((draft) => {
      draft.message = value
      draft.private = isPM
      draft.to = to
      draft.isCommand = isCommand
    })

    if (isPM || isCommand) {
      return;
    }

    draftTimer.current = setTimeout(() => {
      sendMessage(value, true)
    }, 100)
  }

  let icon: IconProp = 'lock'
  if (state.isCommand) {
    icon = 'code'
  }

  return (
    <Form noValidate onSubmit={handleSubmit} className={ classNames(styles.textBox, { [styles.private]: state.private, [styles.command]: state.isCommand }) }>
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
          <FontAwesomeIcon icon={ icon } />
        </span>
      </Form.Group>
    </Form>
  )
}
