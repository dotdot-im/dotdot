import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'
import MessageContent from './MessageContent'
import Heading from './Heading'
import Reply from './Reply'

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

  const isSystem = userData.user_id === 'dotdot'
  const isUserOnline =
    isSystem ||
    state.onlineUsers.findIndex((user) => user.user_id === userData.user_id) >
      -1

  const isReplyAllowed =
    !reply && onClick && !isSystem && !message.attributes.draft

  const onReplyClick = () => {
    if (!isReplyAllowed || !onClick) {
      return
    }
    onClick(message.timestamp.getTime())
  }

  let messageBody
  if (reply) {
    messageBody = message.content.join('. ')
  } else {
    messageBody = message.content.map(content => (
      <MessageContent
        content={content}
        isSystem={isSystem}
        onlineUsers={state.onlineUsers}
        key={ content }
      />
    ))
  }

  return (
    <div
      id={'message-' + message.timestamp.getTime()}
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
            <FontAwesomeIcon icon="reply" /> Reply
          </Button>
        </div>
      )}

      <Heading
        user={ userData }
        timestamp={ message.timestamp }
        isOnline={ isUserOnline }
        isDraft={ message.attributes.draft }
        isPrivate={ message.attributes.private }
        isCurrentUser={ userData.user_id === state.auth.user?.user_id }
      />

      { !reply && (
        <Reply
          replyTo={ message.attributes.replyTo }
          replyToTimestamp={ message.attributes.replyToTimestamp }
        />
      ) }

      <div className={classNames(styles.body)}>
        {messageBody}
      </div>
    </div>
  )
}

export default MessageComponent
