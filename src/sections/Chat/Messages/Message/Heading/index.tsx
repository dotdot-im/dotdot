import React from 'react'
import classNames from 'classnames'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { User } from 'store/types'
import styles from './index.module.scss'

type Props = {
  user: User
  timestamp: Date
  isDraft: boolean
  isPrivate: boolean
  isOnline: boolean
  isCurrentUser: boolean
  isReply?: boolean
}

const Heading = ({
  user,
  timestamp,
  isDraft,
  isPrivate,
  isOnline,
  isCurrentUser,
  isReply,
}: Props) => {
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
  if (isCurrentUser && !isPrivate && !isDraft) {
    icon = ['far', iconName]
  }

  const UserIcon = () => {
    const justIcon = (
      <FontAwesomeIcon icon={icon} spin={!isPrivate && isDraft} />
    )

    return (
      <span className={styles.icon} style={{ color: userContrastColor }}>
        {isPrivate ? (
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
            {justIcon}
          </OverlayTrigger>
        ) : (
          justIcon
        )}
      </span>
    )
  }

  const Username = () => (
    <span style={{ color: userContrastColor }}>{user.name}</span>
  )
  const TimeStamp = () => (
    <span className={classNames(styles.timestamp)}>
      {timestamp.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })}
    </span>
  )

  return (
    <>
      {!isReply && <UserIcon />}

      <div className={classNames(styles.user)}>
        <Username />
        {!isDraft && !isReply && <TimeStamp />}
      </div>
    </>
  )
}

export default Heading
