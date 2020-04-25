import React from 'react'
import { Form } from 'react-bootstrap'
import classNames from 'classnames'

import styles from './index.module.scss'
import useGlobalState from 'store/state'

type Props = {
  value: any
  kind: 'private' | 'command' | false
  inputRef: React.Ref<any>
  onChange: (e: React.ChangeEvent<any>) => void
  children: React.ReactNode
}

export default ({ value, kind, inputRef, onChange, children }: Props) => {
  const { state, dispatch } = useGlobalState()

  const handleFocus = (focus: boolean) => () => {
    dispatch({
      type: 'chat_focus',
      payload: focus,
    })
  }

  return (
    <div
      className={classNames(styles.field, {
        [styles.focused]: state.chat.focused,
        [styles.private]: kind === 'private',
        [styles.command]: kind === 'command',
      })}
    >
      <Form.Control
        ref={inputRef}
        className={styles.inputArea}
        onChange={onChange}
        onFocus={handleFocus(true)}
        onBlur={handleFocus(false)}
        value={value}
        autoFocus
        as="input"
        type="text"
        autoComplete="off"
        placeholder="Type a message..."
      />
      <div className={styles.actions}>{children}</div>
    </div>
  )
}
