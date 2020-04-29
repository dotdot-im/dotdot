import React, { useEffect, useRef, useCallback } from 'react'
import { Container, Button } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'

import MessageComponent from './Message'

import styles from './index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollBox from './ScrollBox'
import useGlobalState from 'store/state'

type State = {
  scrollAtBottom: boolean
  unseenMessages: boolean // are there new messages below the scroll point?
}

type Props = {
  onMessageClick: (messageId: string) => void
}

export default (props: Props) => {
  const { state } = useGlobalState()
  const [localState, setLocalState] = useImmer<State>({
    scrollAtBottom: true,
    unseenMessages: false,
  })

  const chatAreaRef = useRef<HTMLDivElement>(null)

  const onScrollChanged = useCallback(
    (isAtBottom: boolean) => {
      setLocalState((draft) => {
        draft.scrollAtBottom = isAtBottom
        if (isAtBottom) {
          draft.unseenMessages = false
        }
      })
    },
    [setLocalState]
  )

  const scrollToBottom = useCallback(() => {
    if (!chatAreaRef || !chatAreaRef.current) {
      return
    }
    const scrollHeight =
      chatAreaRef.current.scrollHeight - chatAreaRef.current.offsetHeight
      chatAreaRef.current.scroll({
        top: scrollHeight,
        left: 0,
        behavior: 'smooth'
      });

    setLocalState((draft) => {
      draft.scrollAtBottom = true
      draft.unseenMessages = false
    })
  }, [setLocalState])

  useEffect(() => {
    setLocalState((draft) => {
      draft.unseenMessages = !draft.scrollAtBottom
    })
  }, [state.messages, setLocalState])

  return (
    <div className={styles.messages}>
      {localState.unseenMessages && (
        <div className={classNames(styles.unseen)}>
          <Container className={styles.unseenContainer}>
            <Button variant="secondary" size="sm" onClick={scrollToBottom}>
              <FontAwesomeIcon icon="arrow-alt-circle-down" /> New messages
            </Button>
          </Container>
        </div>
      )}
      <div className={classNames(styles.messageScroll)} ref={chatAreaRef}>
        <div className="container">
          <ScrollBox boxRef={chatAreaRef} onScrollChanged={onScrollChanged}>
            {state.messages.map((eachMessage) => (
              <MessageComponent
                key={eachMessage.uuid}
                onClick={props.onMessageClick}
                message={eachMessage}
              />
            ))}
          </ScrollBox>
        </div>
      </div>
    </div>
  )
}
