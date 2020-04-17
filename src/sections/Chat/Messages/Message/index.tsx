import React from 'react'
import classNames from 'classnames'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'
import MessageContent from './MessageContent'
import PlayBackMessage from './PlayBackMessage'

type Props = {
  reply?: boolean
  message: Message
  onClick?: (messageTimestamp: number) => void
}

const MessageComponent = ({ message, onClick, reply }: Props) => {
  const { state } = useGlobalState()

  // User data comes from online users if available
  const userData =
    state.onlineUsers.find((user) => user.user_id === message.user.user_id) ||
    message.user

  const userContrastColor = userData.contrastColor || `#${userData.color}`
  const isSystem = userData.user_id === 'dotdot'
  const isUserOnline =
    isSystem ||
    state.onlineUsers.findIndex((user) => user.user_id === userData.user_id) >
      -1

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

  const isReplyAllowed =
    !reply && onClick && !isSystem && !message.attributes.draft

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

  let messageBody;

  if (reply) {
    messageBody = message.content.join('. ')
  } else if (message.attributes.draft && message.timedContent) {
    messageBody = (
      <PlayBackMessage
        timers={ message.timedContent }
        message={ message.content[0] }
      />
    )
  } else {
    messageBody = message.content.map((content, index) => (
      <MessageContent
        content={content}
        isSystem={isSystem}
        onlineUsers={state.onlineUsers}
        key={index}
      />
    ))
  }

  return (
    <div
      id={ 'message-' + message.timestamp.getTime() }
      className={classNames(styles.message, {
        [styles.reply]: reply,
        [styles.system]: isSystem,
        [styles.offline]: !isUserOnline,
        [styles.inactive]: !userData.isActive,
        [styles.draft]: message.attributes.draft,
        [styles.private]: message.attributes.private,
      })}
    >
      {isReplyAllowed && (
        <div className={styles.replyButton}>
          <Button
            variant="link"
            onClick={onReplyClick}
            title="Reply to this message"
          >
            <FontAwesomeIcon icon="reply" />
          </Button>
        </div>
      )}
      <div
        className={classNames(styles.icon, {
          [styles.private]: message.attributes.private,
        })}
        style={{ color: userContrastColor, background: userContrastColor }}
      >
        {message.attributes.private && (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`user-${userData.user_id}`}>
                Private message from <b>@{userData.name}</b>
                <br />
                Only you can see this.
              </Tooltip>
            }
          >
            <FontAwesomeIcon icon={icon} />
          </OverlayTrigger>
        )}
        {!message.attributes.private && (
          <FontAwesomeIcon icon={icon} spin={message.attributes.draft} />
        )}
      </div>

      <div className={classNames(styles.user)}>
        <span style={{ color: userContrastColor }}>{userData.name}</span>
        {!message.attributes.draft && (
          <span className={classNames(styles.timestamp)}>
            {message.timestamp.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
      {!reply && message.attributes.replyTo && message.attributes.replyTo.user && (
        <a
          href={ '#message-' + message.attributes.replyToTimestamp }
          className={styles.replyBox}
          style={{
            borderLeftColor: `#${message.attributes.replyTo.user.color}`,
          }}
        >
          <MessageComponent reply message={message.attributes.replyTo} />
        </a>
      )}
      <div className={classNames(styles.body)}>
        {messageBody}
      </div>
    </div>
  )
}

export default MessageComponent
