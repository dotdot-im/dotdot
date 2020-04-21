import React, { useContext, useRef } from 'react'
import { Form, Button, InputGroup, Container } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { SocketContext } from 'util/socketProvider'
import { VALID_USERNAME } from '../../../constants'
import useGlobalState from 'store/state'
import { EVENTS, Message, OutgoingMessage } from 'store/types'
import MessageComponent from '../Messages/Message'

import styles from './index.module.scss'
import Field from './Field'
import Submit from './Submit'
import TextIcon from './TextIcon'

type State = {
  message: string
  kind: 'private' | 'command' | false
  to: string | null
}

type Props = {
  isFocused: boolean
  replyTo?: Message | null
  onFocus: () => void
  onBlur: () => void
  onCancelReply?: () => void
}

export default ({
  isFocused,
  replyTo,
  onFocus,
  onBlur,
  onCancelReply,
}: Props) => {
  const { state, dispatch } = useGlobalState()

  const [localState, setState] = useImmer<State>({
    message: '',
    kind: false,
    to: null,
  })
  const draftTimer = useRef<any>(null)
  const inputRef = useRef<any>(null)

  const { socket } = useContext(SocketContext)

  const askForHelp = () => {
    dispatch({
      type: 'system_message',
      payload: '/help',
    })
  }

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault()

    if (localState.message.length < 1 || localState.message.trim().length < 1) {
      return
    }

    sendMessage(localState.message)

    setState((draft) => {
      draft.message = ''
      draft.kind = false
    })

    // refocus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    })

    onCancelReply && onCancelReply()
  }

  const sendMessage = (message: string, draft: boolean = false) => {
    if (!draft && (message.length < 1 || message.trim().length < 1)) {
      return
    }

    if (message === '/help') {
      return askForHelp()
    }

    let type = EVENTS.MESSAGE
    if (localState.kind === 'command') {
      type = EVENTS.COMMAND
    }

    const payload: OutgoingMessage = {
      content: message,
      attributes: {
        draft,
        private: localState.kind === 'private',
        to: localState.to,
        replyToTimestamp: replyTo ? replyTo.timestamp.getTime() : null,
      },
    }

    socket?.emit(type, payload)
  }

  // Message types
  const isMessageCommand = (val: string) => val[0] === '/'
  const isMessagePm = (val: string) => val[0] === '@'
  const getMessageKind = (val: string) => {
    if (isMessageCommand(val)) return 'command'
    if (isMessagePm(val)) return 'private'
    return false
  }

  const getMessagePmTo = (val: string) => {
    const words = val.split(' ')

    if (
      words.length > 0 &&
      words[0][0] === '@' &&
      VALID_USERNAME.test(words[0].substr(1))
    ) {
      return words[0].substr(1)
    }

    return null
  }

  const onType = (e: React.ChangeEvent<any>) => {
    e.preventDefault()

    clearTimeout(draftTimer.current)

    const value: string = e.currentTarget.value
    const kind = getMessageKind(value)

    // special messages
    setState((draft) => {
      draft.message = value
      draft.kind = kind
      draft.to = kind === 'private' ? getMessagePmTo(value) : null
    })

    // What is this for?
    if (kind) {
      return
    }

    if (state.draftTimer > 0) {
      draftTimer.current = setTimeout(() => {
        sendMessage(value, true)
      }, state.draftTimer)
    }
  }

  return (
    <div
      className={classNames(styles.area, {
        [styles.focused]: isFocused,
      })}
    >
      <Container className={styles.container}>
        {replyTo && (
          <div
            className={styles.reply}
            style={{ borderLeftColor: `#${replyTo.user.color}` }}
          >
            <div className={styles.actions}>
              <Button variant="link" onClick={onCancelReply}>
                <FontAwesomeIcon icon="times" />
              </Button>
            </div>
            <MessageComponent reply message={replyTo} />
          </div>
        )}
        <Form
          noValidate
          onSubmit={handleSubmit}
          className={classNames({
            [styles.private]: localState.kind === 'private',
            [styles.command]: localState.kind === 'command',
          })}
        >
          <Field
            inputRef={inputRef}
            value={localState.message}
            isFocused={isFocused}
            onChange={onType}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <InputGroup.Append>
              <Submit />
            </InputGroup.Append>
            <TextIcon kind={localState.kind} onHelp={askForHelp} />
          </Field>
        </Form>
      </Container>
    </div>
  )
}
