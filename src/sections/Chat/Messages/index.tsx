import React, { useEffect, useContext, useRef } from 'react'
import { Container } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import { SocketContext } from 'util/socketProvider'
import { Message } from 'store/types'
import MessageComponent from './Message'

import styles from './index.module.scss'

type State = {
  messages: Message[]
}

export default () => {
  const [state, setState] = useImmer<State>({
    messages: [],
  })

  const { socket } = useContext(SocketContext)

  const chatAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chatAreaRef || !chatAreaRef.current) {
      return
    }
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
  }, [state.messages])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('message', (payload: Message) => {

      setState((draft) => {
        // delete draft from this user
        const existingDraft = draft.messages.findIndex(
          (eachMessage) =>
            eachMessage.attributes.draft &&
            eachMessage.user.user_id === payload.user.user_id
        )
        if (existingDraft > -1) {
          draft.messages.splice(existingDraft, 1)
        }

        if (!payload.attributes.draft) {
          const lastMessage = draft.messages[draft.messages.length - 1]

          if (lastMessage && lastMessage.user.user_id === payload.user.user_id && lastMessage.attributes.private === payload.attributes.private) {
            // last message was by this same user (and it's the same kind of message)
            lastMessage.message += `\n${payload.message}`
            return
          }
        }

        draft.messages.push({
          id: draft.messages.length,
          time: new Date(),
          attributes: payload.attributes,
          message: payload.message,
          user: payload.user,
        })
      })
    })
  }, [socket, setState])

  return (
    <div className={classNames(styles.messages, 'my-4')} ref={chatAreaRef}>
      <Container>
        <div className={classNames(styles.messageList)}>
          {state.messages.map((eachMessage) => (
            <MessageComponent key={eachMessage.id} message={eachMessage} />
          ))}
        </div>
      </Container>
    </div>
  )
}
