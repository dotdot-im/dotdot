import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MessageComponent from '../../Messages/Message'
import { Message } from 'store/types'

import styles from './index.module.scss'

type Props = {
  replyTo: Message
  onCancelReply: () => void
}

export default ({ replyTo, onCancelReply }: Props) => {
  return (
    <div
      className={styles.reply}
      style={{ borderLeftColor: `#${replyTo.user.color}` }}
    >
      <div className={styles.actions}>
        <Button variant="link" onClick={onCancelReply}>
          <FontAwesomeIcon icon="times" />
        </Button>
      </div>
      <MessageComponent reply message={replyTo} />
    </div>
  )
}
