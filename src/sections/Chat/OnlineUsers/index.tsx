import React, { useEffect, useContext } from 'react'
import { useImmer } from 'use-immer'

import { SocketContext } from 'util/socketProvider'
import { User } from 'store/types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import styles from './index.module.scss'

type State = {
  users: User[]
}

export default () => {
  const [state, setState] = useImmer<State>({
    users: [],
  })

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('users', (payload: any) => {
      setState((draft) => {
        draft.users = payload.users
      })
    })
  }, [socket, setState])

  return (
    <div className={styles.onlineUsers}>
      {state.users.map((user) => (
        <OverlayTrigger
          key={user.user_id}
          placement="bottom"
          overlay={<Tooltip id={`user-${user.user_id}`}>@{user.name}</Tooltip>}
        >
          <span style={{ color: `#${user.color}` }}>&bull;</span>
        </OverlayTrigger>
      ))}
    </div>
  )
}
