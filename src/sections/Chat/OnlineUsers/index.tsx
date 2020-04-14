import React from 'react'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'
import useGlobalState from 'store/state'

export default () => {
  const { state } = useGlobalState();

  return (
    <div className={styles.onlineUsers}>
      {
        state.onlineUsers.map((user) => {
          const isCurrentUser = user.user_id === state.auth.user?.user_id

          let iconName: IconName = 'circle'
          if (user.icon) {
            iconName = user.icon
          } else if (user.user_id === state.auth.user?.user_id) {
            iconName = 'dot-circle'
          }

          if (!user.isActive) {
            iconName = 'meh'
          }

          let icon: IconProp = iconName
          if (isCurrentUser) {
            icon = ['far', iconName]
          }

          let inactive = '';
          if (!user.isActive) {
            inactive = ' (away)'
          }

          return (
            <OverlayTrigger
              key={user.user_id}
              placement="bottom"
              overlay={<Tooltip id={`user-${user.user_id}`}>
                @{user.name}
                { inactive }
              </Tooltip>}
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
