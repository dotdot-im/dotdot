import React from 'react'
import classNames from 'classnames'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { User } from 'store/types'
import styles from './index.module.scss'
import Dot from 'components/Dot'

type Props = {
  user: User
  timestamp: Date
  isDraft: boolean
  isPrivate: boolean
  isOnline: boolean
  isReply?: boolean
}

const Heading = ({
  user,
  timestamp,
  isDraft,
  isPrivate,
  isOnline,
  isReply,
}: Props) => {
  const userColor = user.contrastColor || `#${user.color}`

  const Username = () => <span style={{ color: userColor }}>{user.name}</span>
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
      {!isReply && (
        <span className={styles.icon}>
          <Dot
            isDraft={isDraft}
            isOnline={isOnline}
            isPrivate={isPrivate}
            pointOp={true}
            user={user}
          />
        </span>
      )}

      <div className={classNames(styles.user)}>
        <Username />
        {!isDraft && !isReply && <TimeStamp />}
      </div>
    </>
  )
}

export default Heading
