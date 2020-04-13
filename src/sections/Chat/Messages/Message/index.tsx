import React from 'react'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'
import HelpMessage from './HelpMessage'

type Props = {
  message: Message
}

const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi');
const URL_REGEX = new RegExp(/((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?)/, 'gmi');

export default (props: Props) => {
  const { state } = useGlobalState()

  // User data comes from online users if available
  const userData = state.onlineUsers.find(
    user => user.user_id === props.message.user.user_id
  ) || props.message.user

  const userColor = `#${userData.color}`
  const isSystem = userData.user_id === 'dotdot'
  const isUserOnline = isSystem || (state.onlineUsers.findIndex(user => user.user_id === userData.user_id) > -1)

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

  let message

  if (isSystem && props.message.message === '/help') {
    message = (
      <HelpMessage />
    )
  } else {
    // replace mentions with colored version
    message = reactStringReplace(props.message.message, USER_REGEX, (username, index) => {
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
    // auto-link urls
    message = reactStringReplace(message, URL_REGEX, (url) => {
      return (
        <a key={ url } href={ url } rel="noopener noreferrer" target='_blank'>{ url }</a>
      )
    })
  }

  return (
    <div
      className={classNames(styles.message, {
        [styles.system]: isSystem,
        [styles.offline]: !isUserOnline,
        [styles.inactive]: !userData.isActive,
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
