import React from 'react'

import { Message } from 'store/types'
import styles from './index.module.scss'
import MessageComponent from '..'

type Props = {
  replyTo: Message | null | undefined
  replyToId: string | null | undefined
}

const Reply = ({ replyTo, replyToId }: Props) => {
  if (!replyTo || !replyTo.user) {
    return null
  }

  return (
    <a
      href={'#message-' + replyToId}
      className={styles.replyBox}
      title="Go to original message"
      style={{
        borderLeftColor: `#${replyTo.user.color}`,
      }}
    >
      <MessageComponent reply message={replyTo} />
    </a>
  )
}

export default Reply
