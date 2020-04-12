import React, { useState, useEffect } from 'react'
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

export default () => {
  const { state } = useGlobalState()
  const [isTextBoxFocused, setTextBoxFocused] = useState(false)
  const [focusedResizing, setFocusedResizing] = useState(false)

  let chatArea = <Loader />
  let headerStyle = {
    position: 'static',
    top: '0px',
  } as React.CSSProperties

  // On window scroll
  const setHeaderPosition = () => {
    if (isTextBoxFocused) {
      // And while focused on field
      if (!focusedResizing) {
        setFocusedResizing(true)
        headerStyle.position = 'absolute'
      }
      // Update the header top position
      headerStyle.top = window.pageYOffset + 'px'
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', setHeaderPosition, true)
  }, [])

  const handleTextBoxFocus = () => {
    setTextBoxFocused(true)
    setHeaderPosition()
  }

  const handleTextBoxBlur = () => {
    setTextBoxFocused(false)
    if (focusedResizing) {
      setFocusedResizing(false)
      headerStyle.position = 'fixed'
      headerStyle.top = 0
    }
  }

  if (state.socket.connected) {
    chatArea = (
      <div className={styles.chat}>
        <div className={classNames(styles.header)} style={headerStyle}>
          <Container>
            <Row>
              <Col>
                <PasswordLock />
                {state.auth.user?.isAdmin && (
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

        <Messages />
        <TextBox onFocus={handleTextBoxFocus} onBlur={handleTextBoxBlur} />
      </div>
    )
  }

  return chatArea
}
