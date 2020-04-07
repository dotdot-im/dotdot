import React, { useEffect, useContext } from 'react'
import { useImmer } from 'use-immer'

import { SocketContext } from 'util/socketProvider'
import { User } from 'store/types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import useGlobalState from 'store/state'

type State = {
  users: User[]
}

export default () => {
  const { state } = useGlobalState();
  const [localState, setState] = useImmer<State>({
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
      {
        localState.users.map((user) => {
          let icon: IconProp = 'circle'
          if (user.user_id === state.auth.user?.user_id) {
            icon = ['far', 'dot-circle']
          }
          return (
            <OverlayTrigger
              key={user.user_id}
              placement="bottom"
              overlay={<Tooltip id={`user-${user.user_id}`}>@{user.name}</Tooltip>}
            >
              <span style={{ color: `#${user.color}` }}>
                <FontAwesomeIcon icon={ icon } />
              </span>
            </OverlayTrigger>
          )
        })
      }
    </div>
  )
}
