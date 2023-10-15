import React from 'react'
import classNames from 'classnames'

import { Message } from 'store/types'
import styles from './index.module.scss'
import useGlobalState from 'store/state'
import MessageContent from './MessageContent'
import PlayBackMessage from './PlayBackMessage'
import Heading from './Heading'
import Reply from './Reply'
import ReplyButton from './ReplyButton'

export type Props = {
  reply?: boolean
  message: Message
  onClick?: (messageId: string) => void
}

const MessageComponent = React.memo(({ message, onClick, reply }: Props) => {
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

  const handleReplyClick = () => {
    if (!isReplyAllowed || !onClick) {
      return
    }
    onClick(message.uuid)
  }

  // TODO Move this to a MessageBody component or something like that
  let messageBody
  if (reply) {
    messageBody = message.content.join('. ')
  } else if (message.attributes.draft && message.timedContent) {
    messageBody = (
      <PlayBackMessage
        timers={message.timedContent}
        message={message.content[0]}
      />
    )
  } else {
    messageBody = message.content.map((content) => (
      <MessageContent
        content={content}
        isSystem={isSystem}
        onlineUsers={state.onlineUsers}
        key={content}
      />
    ))
  }

  return (
    <div
      id={'message-' + message.uuid}
      className={classNames(styles.message, {
        [styles.reply]: reply,
        [styles.system]: isSystem,
        [styles.offline]: !isUserOnline,
        [styles.inactive]: !userData.isActive,
        [styles.draft]: message.attributes.draft,
        [styles.private]: message.attributes.private,
      })}
    >
      <div className={styles.frame}>
        {isReplyAllowed && (
          <div className={styles.actions}>
            <ReplyButton onClick={handleReplyClick} />
          </div>
        )}

        <Heading
          user={userData}
          timestamp={message.timestamp}
          isReply={reply}
          isOnline={isUserOnline}
          isDraft={message.attributes.draft}
          isPrivate={message.attributes.private}
        />
      </div>

      {!reply && (
        <Reply
          replyTo={message.attributes.replyTo}
          replyToId={message.attributes.replyToId}
        />
      )}

      <div className={classNames(styles.body)}>{messageBody}</div>
    </div>
  )
})

export default MessageComponent
