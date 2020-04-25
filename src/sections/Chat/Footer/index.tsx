import React, { useEffect, useCallback, useContext, useRef } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import { SocketContext } from 'util/socketProvider'
import { getMessageKind, getMessagePmTo } from 'lib/messageParse'
import useGlobalState from 'store/state'
import { EVENTS, Message, OutgoingMessage } from 'store/types'

import Reply from './Reply'
import Field from './Field'
import Submit from './Submit'
import TextIcon from './TextIcon'

import styles from './index.module.scss'

type State = {
  message: string
  kind: 'private' | 'command' | false
  to: string | null
}

type Props = {
  replyTo?: Message | null
  onCancelReply: () => void
}

export default ({ replyTo, onCancelReply }: Props) => {
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

  const FieldActions = () => (
    <>
      <TextIcon kind={localState.kind} onHelp={askForHelp} />
      <Submit disabled={!state.chat.focused} />
    </>
  )

  return (
    <div className={styles.area}>
      <Container className={styles.container}>
        {replyTo && <Reply replyTo={replyTo} onCancelReply={onCancelReply} />}
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
            onChange={onType}
          >
            <FieldActions />
          </Field>
        </Form>
      </Container>
    </div>
  )
}
