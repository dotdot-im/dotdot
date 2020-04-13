import React, { createContext, useEffect, useState } from 'react'
import socketio from 'socket.io-client'

import { useGlobalState } from 'store/state'
import { API_URL } from '../constants'
import { Message, EVENTS } from 'store/types'

const USAGE_TIMER_INTERAL = 30 * 1000

type SocketContextType = {
  socket: SocketIOClient.Socket | null
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
})

type Props = {
  children: any
}

export default (props: Props) => {
  const { state, dispatch } = useGlobalState()
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)

  useEffect(() => {
    // clear any errors
    dispatch({
      type: 'error',
      payload: null,
    })

    if (!state.auth.loggedIn) {
      return
    }

    // initialize the socket
    const newSocket = socketio(API_URL, {
      reconnection: true,
      timeout: 2000,
    })

    setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('timer')
      }
    }, USAGE_TIMER_INTERAL)

    // remind to set a password
    if (!state.auth.user?.hasPassword) {
      setTimeout(() => {
        dispatch({
          type: 'system_message',
          payload: 'Remember: If you want to keep this username, you must set a password! You can set it by clicking on the lock icon on the top left of the screen.'
        })
      }, 60 * 1000);
    }

    Object.values(EVENTS).forEach(event => {
      newSocket.on(event, (payload: any) => {
        dispatch({
          type: `socket_${event}`,
          payload: payload,
        })
      })
    })

    newSocket.on('stats', (payload: Message[]) => {
      dispatch({
        type: 'stats',
        payload,
      })
    })

    newSocket.on('connect_error', () => {
      dispatch({
        type: 'offline',
        payload: null,
      })
    })

    newSocket.on('connect_timeout', () => {
      dispatch({
        type: 'offline',
        payload: null,
      })
    })

    newSocket.on('error', (error: string) => {
      dispatch({
        type: `socket_${EVENTS.DISCONNECT}`,
      })

      if (error) {
        dispatch({
          type: 'error',
          payload: error,
        })
        dispatch({
          type: 'login',
          payload: null,
        })
      } else {
        dispatch({
          type: 'offline',
          payload: null,
        })
      }
    })

    setSocket(newSocket)
  }, [dispatch, state.auth.loggedIn])

  let provider = {
    socket,
  }

  return (
    <SocketContext.Provider value={provider}>
      {props.children}
    </SocketContext.Provider>
  )
}
