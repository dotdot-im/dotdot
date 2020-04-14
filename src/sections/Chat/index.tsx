import React, { useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useGlobalState } from 'store/state'
import Loader from 'components/Loader'

import styles from './index.module.scss'
import Messages from './Messages'
import TextBox from './TextBox'
import OnlineUsers from './OnlineUsers'
import PasswordLock from './PasswordLock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useImmer } from 'use-immer'
import { Message } from 'store/types'

type State = {
  isTextBoxFocused: boolean,
  scrollingWhileFocused: boolean,
  replyTo: Message | null,
}

export default () => {
  const { state } = useGlobalState()
  const [ localState, setState ] = useImmer<State>({
    isTextBoxFocused: false,
    scrollingWhileFocused: false,
    replyTo: null,
  })

  let chatArea = <Loader />

  const onMessageClick = useCallback((messageTimestamp: number) => {
    setState(draft => {
      const messageReply = state.messages.find(eachMessage => eachMessage.timestamp.getTime() === messageTimestamp) || null
      console.log('replying to ', messageReply);
      draft.replyTo = messageReply
    })
  }, [state.messages, setState])

  const cancelReply = useCallback(() => {
    setState(draft => {
      draft.replyTo = null
    })
  }, [setState])

  // On window scroll
  const setHeaderPosition = useCallback(() => {
    setState(draft => {
      if (draft.isTextBoxFocused) {
        draft.scrollingWhileFocused = true
      }
    })
    // eslint-disable-next-line
  }, [setState]);

  useEffect(() => {
    window.addEventListener('scroll', setHeaderPosition, true)

    return () => {
      window.removeEventListener('scroll', setHeaderPosition)
    }
  }, [setHeaderPosition])

  const handleTextBoxFocus = () => {
    setState(draft => {
      draft.isTextBoxFocused = true
    })
    setHeaderPosition()
  }

  const handleTextBoxBlur = () => {
    setState(draft => {
      draft.isTextBoxFocused = false
      draft.scrollingWhileFocused = false
    })
  }

  const headerStyle = {
    position: 'static',
    top: 0,
  } as React.CSSProperties

  if (localState.scrollingWhileFocused) {
    headerStyle.position = 'absolute';
    headerStyle.top = window.pageYOffset + 'px'
  }

  if (state.socket.connected) {
    chatArea = (
      <div className={classNames(styles.chat, { [styles.scrollingChat]: localState.scrollingWhileFocused })}>
        <div className={classNames(styles.header)} style={headerStyle}>
          <Container>
            <Row>
              <Col>
                <PasswordLock />
                {state.auth.user && state.auth.user.isAdmin && (
                  <Link
                    to="/admin"
                    title="Monitoring"
                    style={{ marginLeft: '1em' }}
                  >
                    <FontAwesomeIcon icon="shield-alt" />
                  </Link>
                )}
              </Col>
              <Col>
                <OnlineUsers />
              </Col>
            </Row>
          </Container>
        </div>

        <Messages
          onMessageClick={ onMessageClick }
        />
        <TextBox
          replyTo={ localState.replyTo }
          onFocus={handleTextBoxFocus}
          onBlur={handleTextBoxBlur}
          onCancelReply={ cancelReply }
        />
      </div>
    )
  }

  return chatArea
}
