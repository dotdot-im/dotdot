import React from 'react'
import { Form } from 'react-bootstrap'

import styles from './index.module.scss'
import useGlobalState from 'store/state'

type Props = {
  value: any
  children: React.ReactNode
  inputRef: React.Ref<any>
  onChange: (e: React.ChangeEvent<any>) => void
  onBlur: () => void
}

export default ({ inputRef, onChange, onBlur, value, children }: Props) => {
  const { dispatch } = useGlobalState()

  const handleFocus = (focus: boolean) => () => {
    dispatch({
      type: 'chat_focus',
      payload: focus,
    })
  }

  return (
    <div className={styles.field}>
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
