import React from 'react'
import classNames from 'classnames'
import { Message } from 'store/types'

import styles from './index.module.scss'
import useGlobalState from 'store/state'

type Props = {
  message: Message
}

export default (props: Props) => {
  const { state } = useGlobalState()

  const userColor = `#${props.message.user.color}`

  const style: any = {}

  return (
    <div
      className={classNames(styles.message, {
        [styles.draft]: props.message.attributes.draft,
        [styles.private]: props.message.attributes.private,
        [styles.privateDraft]:
          props.message.attributes.private && props.message.attributes.draft,
      })}
      key={props.message.id}
      style={style}
    >
      <div className={classNames(styles.header)} style={{ color: userColor }} />
      <div className={classNames(styles.timestamp)}>
        {props.message.attributes.draft ? 'typing...' : '12:34'}
      </div>
      <span
        className={classNames(styles.user, {
          [styles.op]: props.message.user.user_id === state.auth.user?.user_id,
        })}
      >
        {props.message.user.name}
      </span>
      <div className={classNames(styles.body)}>{props.message.message}</div>
    </div>
  )
}
