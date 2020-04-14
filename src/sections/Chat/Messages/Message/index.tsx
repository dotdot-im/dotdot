import React from 'react'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'
import HelpMessage from './HelpMessage'

type Props = {
  reply?: boolean
  message: Message
  onClick?: (messageTimestamp: number) => void,
}

const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi');
const URL_REGEX = new RegExp(/((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?)/, 'gmi');

const MessageComponent = ({ message, onClick, reply }: Props) => {
  const { state } = useGlobalState()

  // User data comes from online users if available
  const userData = state.onlineUsers.find(
    user => user.user_id === message.user.user_id
  ) || message.user

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
  } else if (message.attributes.draft) {
    iconName = 'circle-notch'
  } else if (message.attributes.private) {
    iconName = 'lock'
  } else if (!isUserOnline) {
    iconName = 'meh'
  }

  const isReplyAllowed = !reply && onClick && !isSystem && !message.attributes.draft

  const onReplyClick = () => {
    if (!isReplyAllowed || !onClick) {
      return
    }
    onClick(message.timestamp.getTime())
  }

  let icon: IconProp = iconName
  if (userData.user_id === state.auth.user?.user_id) {
    icon = ['far', iconName]
  }

  let messageContent

  if (isSystem && message.message === '/help') {
    messageContent = (
      <HelpMessage />
    )
  } else {
    // replace mentions with colored version
    messageContent = reactStringReplace(message.message, USER_REGEX, (username, index) => {
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
    messageContent = reactStringReplace(messageContent, URL_REGEX, (url) => {
      return (
        <a key={ url } href={ url } rel="noopener noreferrer" target='_blank'>{ url }</a>
      )
    })
  }

  return (
    <div
      className={classNames(styles.message, {
        [styles.reply]: reply,
        [styles.system]: isSystem,
        [styles.offline]: !isUserOnline,
        [styles.inactive]: !userData.isActive,
        [styles.draft]: message.attributes.draft,
        [styles.private]: message.attributes.private,
      })}
    >
      { isReplyAllowed && (
        <div className={ styles.replyButton }>
          <Button variant='link' onClick={ onReplyClick } title='Reply to this message'>
            <FontAwesomeIcon icon='reply' />
          </Button>
        </div>
      ) }
      <div className={classNames(styles.icon, { [styles.private]: message.attributes.private })} style={{ color: userColor, background: userColor }}>
        { message.attributes.private && (
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
        { !message.attributes.private && (
          <FontAwesomeIcon icon={ icon } spin={ message.attributes.draft } />
        ) }
      </div>
      <div className={classNames(styles.timestamp)}>
        {message.attributes.draft ? 'now' : message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
      <span
        className={classNames(styles.user)}
        style={ { color: userColor } }
      >
        {userData.name}
      </span>
      { !reply && message.attributes.replyTo && (
        <div className={ styles.replyBox } style={ { borderLeftColor: `#${message.attributes.replyTo.user.color}` } }>
          <MessageComponent
            reply
            message={ message.attributes.replyTo }
          />
        </div>
      ) }
      <div className={classNames(styles.body)}>
        {messageContent}
      </div>
    </div>
  )
}

export default MessageComponent