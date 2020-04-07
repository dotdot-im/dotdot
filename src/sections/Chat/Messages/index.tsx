import React, { useEffect, useContext, useRef, useCallback } from 'react'
import { Container, Button } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import { SocketContext } from 'util/socketProvider'
import { Message } from 'store/types'
import MessageComponent from './Message'

import styles from './index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollBox from './ScrollBox'

type State = {
  messages: Message[],
  scrollAtBottom: boolean,
  unseenMessages: boolean, // are there new messages below the scroll point?
}

export default () => {
  const [state, setState] = useImmer<State>({
    messages: [],
    scrollAtBottom: true,
    unseenMessages: false,
  })

  const { socket } = useContext(SocketContext)

  const chatAreaRef = useRef<HTMLDivElement>(null)

  const onScrollChanged = useCallback((isAtBottom: boolean) => {
    setState(draft => {
      draft.scrollAtBottom = isAtBottom
      if (isAtBottom) {
        draft.unseenMessages = false
      }
    })
  }, [setState])

  const scrollToBottom = useCallback(() => {
    if (!chatAreaRef || !chatAreaRef.current) {
      return
    }
    const scrollHeight = chatAreaRef.current.scrollHeight - chatAreaRef.current.offsetHeight
    chatAreaRef.current.scrollTop = scrollHeight

    setState(draft => {
      draft.unseenMessages = false
    })
  }, [setState])

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

        if (payload.message.trim().length < 1) {
          return;
        }

        draft.unseenMessages = !draft.scrollAtBottom

        if (!payload.attributes.draft) {
          const lastMessage = draft.messages[draft.messages.length - 1]

          if (lastMessage && lastMessage.user.user_id === payload.user.user_id && lastMessage.attributes.private === payload.attributes.private) {
            // last message was by this same user (and it's the same kind of message)
            lastMessage.message += `\n${payload.message}`
            lastMessage.timestamp = new Date(payload.timestamp)
            return
          }
        }

        draft.messages.push({
          timestamp: new Date(payload.timestamp),
          attributes: payload.attributes,
          message: payload.message,
          user: payload.user,
        })
      })
    })
    socket.on('history', (payload: Message[]) => {
      setState(draft => {
        if (draft.messages.length > 0) {
          return;
        }
        draft.messages = payload.map(eachMessage => {
          eachMessage.timestamp = new Date(eachMessage.timestamp)
          return eachMessage
        });
      });
    })
  }, [socket, setState])

  return (
    <div className={ styles.messages }>
      { state.unseenMessages && (
        <div className={ classNames(styles.unseen) }>
          <Container className={ styles.unseenContainer }>
            <Button variant="outline-secondary" size="sm" onClick={ scrollToBottom }>
              <FontAwesomeIcon icon='arrow-alt-circle-down' /> New messages
            </Button>
          </Container>
        </div>
      ) }
        <div className={classNames(styles.messageScroll)} ref={chatAreaRef}>
          <div className='container'>
            <ScrollBox
              boxRef={ chatAreaRef }
              onScrollChanged={ onScrollChanged }
            >
              {state.messages.map((eachMessage) => (
                <MessageComponent key={eachMessage.timestamp.toDateString()} message={eachMessage} />
              ))}
            </ScrollBox>
          </div>
        </div>
    </div>
  )
}
