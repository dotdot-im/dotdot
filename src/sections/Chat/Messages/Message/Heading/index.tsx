import React from 'react'
import classNames from 'classnames'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { User } from 'store/types'
import styles from '../index.module.scss'

type Props = {
  user: User
  timestamp: Date
  isDraft: boolean
  isPrivate: boolean
  isOnline: boolean
  isCurrentUser: boolean
}

const Heading = ({ user, timestamp, isDraft, isPrivate, isOnline, isCurrentUser }: Props) => {
  const userContrastColor = user.contrastColor || `#${user.color}`
  const isSystem = user.user_id === 'dotdot'

  let iconName: IconName = 'circle'
  if (user.icon) {
    iconName = user.icon
  } else if (isCurrentUser) {
    iconName = 'dot-circle'
  }

  // special icons
  if (isSystem) {
    iconName = 'cog'
  } else if (isDraft) {
    iconName = 'circle-notch'
  } else if (isPrivate) {
    iconName = 'lock'
  } else if (!isOnline) {
    iconName = 'meh'
  }

  let icon: IconProp = iconName
  if (isCurrentUser) {
    icon = ['far', iconName]
  }

  return (
    <>
      <div
        className={classNames(styles.icon, {
          [styles.private]: isPrivate,
        })}
        style={{ color: userContrastColor, background: userContrastColor }}
      >
        {isPrivate && (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`user-${user.user_id}`}>
                Private message from <b>@{user.name}</b>
                <br />
                Only you can see this.
              </Tooltip>
            }
          >
            <FontAwesomeIcon icon={icon} />
          </OverlayTrigger>
        )}
        {!isPrivate && (
          <FontAwesomeIcon icon={icon} spin={ isDraft } />
        )}
      </div>

      <div className={classNames(styles.user)}>
        <span style={{ color: userContrastColor }}>{user.name}</span>
        {!isDraft && (
          <span className={classNames(styles.timestamp)}>
            {timestamp.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </>
  )
}

export default Heading
