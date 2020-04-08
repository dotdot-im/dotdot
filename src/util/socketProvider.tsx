import React, { createContext, useEffect, useState } from 'react'
import socketio from 'socket.io-client'

import { useGlobalState } from 'store/state'
import { API_URL } from '../constants'

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

    newSocket.on('connect', () => {
      dispatch({
        type: 'socketConnected',
        payload: true,
      })
    })

    newSocket.on('users', (payload: any) => {
      dispatch({
        type: 'onlineUsers',
        payload: payload.users,
      })
    })

    newSocket.on('connect_error', (error: string) => {
      dispatch({
        type: 'offline',
        payload: null,
      })
    })

    newSocket.on('connect_timeout', (timeout: string) => {
      dispatch({
        type: 'offline',
        payload: null,
      })
    })

    newSocket.on('error', (error: string) => {
      dispatch({
        type: 'socketConnected',
        payload: false,
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
