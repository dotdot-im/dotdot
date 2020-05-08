import React from 'react'
import classNames from 'classnames'

import { Message } from 'store/types'
import styles from './index.module.scss'
import messageStyles from '../index.module.scss'
import MessageComponent from '..'

type Props = {
  replyTo: Message | null | undefined
  replyToId: string | null | undefined
}

const Reply = ({ replyTo, replyToId }: Props) => {
  if (!replyTo || !replyTo.user) {
    return null
  }

  const Bar = () => (
    <span
      aria-hidden={true}
      className={styles.bar}
      style={{
        background: replyTo.user.contrastColor || `#${replyTo.user.color}`,
      }}
    />
  )

  return (
    <a
      href={'#message-' + replyToId}
      className={classNames(styles.replyBox, {
        [messageStyles.private]: replyTo.attributes.private,
      })}
      title="Go to original message"
    >
      <Bar />
      <div className={styles.scroll}>
        <MessageComponent reply message={replyTo} />
      </div>
    </a>
  )
}

export default Reply
