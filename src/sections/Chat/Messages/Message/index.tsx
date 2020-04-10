import React from 'react'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'

type Props = {
  message: Message
}

export default (props: Props) => {
  const { state } = useGlobalState()

  // User data comes from online users if available
  const userData = state.onlineUsers.find(
    user => user.user_id === props.message.user.user_id
  ) || props.message.user

  const userColor = `#${userData.color}`
  const isSystem = userData.user_id === 'dotdot'
  const isUserOnline = isSystem || (state.onlineUsers.findIndex(user => user.user_id === userData.user_id) > -1 && userData.isActive)

  let iconName: IconName = 'circle'
  if (userData.icon) {
    iconName = userData.icon
  } else if (userData.user_id === state.auth.user?.user_id) {
    iconName = 'dot-circle'
  }

  // special icons
  if (isSystem) {
    iconName = 'cog'
  } else if (props.message.attributes.draft) {
    iconName = 'circle-notch'
  } else if (props.message.attributes.private) {
    iconName = 'lock'
  } else if (!isUserOnline) {
    iconName = 'meh'
  }

  let icon: IconProp = iconName
  if (userData.user_id === state.auth.user?.user_id) {
    icon = ['far', iconName]
  }

  // replace mentions with colored version
  const message = reactStringReplace(props.message.message, /@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)/gmi, (username, index) => {
    let style = {}
    const userIndex = state.onlineUsers.findIndex(user => user.name === username)
    if (userIndex > -1) {
      style = {
        color: `#${state.onlineUsers[userIndex].color}`
      }
    }
    return (
      <span key={index} className={ styles.mention } style={ style }>
        @{username}
      </span>
    );
  })

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
              <Tooltip id={`user-${userData.user_id}`}>
                Private message from <b>@{userData.name}</b><br />
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
        {userData.name}
      </span>
      <div className={classNames(styles.body)}>
        {message}
      </div>
    </div>
  )
}
