import React from 'react'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import useGlobalState from 'store/state'

export default () => {
  const { state } = useGlobalState();

  return (
    <div className={styles.onlineUsers}>
      {
        state.onlineUsers.map((user) => {
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
