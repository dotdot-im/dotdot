import React from 'react'
import classNames from 'classnames'
import { Message } from 'store/types'

import styles from './index.module.scss'
import useGlobalState from 'store/state'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

type Props = {
  message: Message
}

export default (props: Props) => {
  const { state } = useGlobalState()

  const userColor = `#${props.message.user.color}`
  const isSystem = props.message.user.user_id === 'dotdot'
  const isUserOnline = isSystem || state.onlineUsers.findIndex(user => user.user_id === props.message.user.user_id) > -1

  let icon: IconProp = 'circle'
  if (props.message.user.user_id === state.auth.user?.user_id) {
    icon = ['far', 'dot-circle']
  } else if (props.message.attributes.draft) {
    icon = 'circle-notch'
  }
  if (props.message.attributes.private) {
    icon = 'lock'
  }
  if (isSystem) {
    icon = 'cog'
  }
  if (!isUserOnline) {
    icon = 'meh'
  }

  return (
    <div
      className={classNames(styles.message, {
        [styles.system]: isSystem,
        [styles.offline]: !isUserOnline,
        [styles.draft]: props.message.attributes.draft,
        [styles.private]: props.message.attributes.private,
      })}
      key={props.message.timestamp.toDateString()}
    >
      <div className={classNames(styles.icon, { [styles.private]: props.message.attributes.private })} style={{ color: userColor, background: userColor }}>
        { props.message.attributes.private && (
          <OverlayTrigger
            placement="right"
            overlay={(
              <Tooltip id={`user-${props.message.user.user_id}`}>
                Private message from <b>@{props.message.user.name}</b><br />
                Only you can see this.
              </Tooltip>
            )}
          >
            <FontAwesomeIcon icon={ icon } />
          </OverlayTrigger>
        ) }
        { !props.message.attributes.private && (
          <FontAwesomeIcon icon={ icon } spin={ props.message.attributes.draft } />
        ) }
      </div>
      <div className={classNames(styles.timestamp)}>
        {props.message.attributes.draft ? 'now' : props.message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
      <span
        className={classNames(styles.user)}
        style={ { color: userColor } }
      >
        {props.message.user.name}
      </span>
      <div className={classNames(styles.body)}>{props.message.message}</div>
    </div>
  )
}
