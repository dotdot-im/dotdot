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

  if (props.message.attributes.draft) {
    style.color = '#aaa'
  }

  if (props.message.attributes.private) {
    style.color = 'orange'
  }

  return (
    <div
      className={classNames(styles.message)}
      key={props.message.id}
      style={style}
    >
      <div className={classNames(styles.header)} style={{ color: userColor }} />
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
