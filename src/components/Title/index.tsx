import React, { useEffect, useContext, useState, useCallback } from 'react'
import Helmet from 'react-helmet'

import { SocketContext } from 'util/socketProvider'
import { Message } from 'store/types'
import useGlobalState from 'store/state'

export default () => {
  const { state } = useGlobalState();
  const { socket } = useContext(SocketContext)

  const [windowFocused, setWindowFocused] = useState<boolean>(true)
  const [titleNotification, setTitleNotification] = useState<boolean>(false)

  const onMessage = useCallback((msg: Message) => {
    const user = state.auth.user;
    if (!windowFocused && user && user.user_id !== msg.user.user_id) {
      setTitleNotification(true)
    }
  }, [windowFocused, state.auth.user])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('message', onMessage)
  }, [socket, onMessage])

  window.onfocus = function () {
    setTitleNotification(false)
    setWindowFocused(true)
  }

  window.onblur = function () {
    setWindowFocused(false)
  }

  return (
    <Helmet>
      <title>{titleNotification ? '• dotdot' : 'dotdot'}</title>
    </Helmet>
  )
}
