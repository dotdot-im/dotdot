import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

import styles from './index.module.scss'

type Props = {
  isFocused: boolean
  value: any
  children: React.ReactNode
  inputRef: React.Ref<any>
  onChange: (e: React.ChangeEvent<any>) => void
  onFocus: () => void
  onBlur: () => void
}

export default ({
  inputRef,
  onChange,
  onFocus,
  onBlur,
  value,
  children,
}: Props) => {
  return (
    <InputGroup className={styles.field}>
      <Form.Control
        ref={inputRef}
        className={styles.inputArea}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        autoFocus
        as="input"
        type="text"
        autoComplete="off"
        placeholder="Type a message..."
      />
      {children}
    </InputGroup>
  )
}
