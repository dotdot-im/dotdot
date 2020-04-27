import React from 'react'

import { useGlobalState } from 'store/state'
import styles from './index.module.scss'

export default () => {
  const { state } = useGlobalState()

  if (!state.offline && !state.error) {
    return null
  }

  let error = state.error
  if (Array.isArray(error)) {
    error = error.join('. ')
  }
  if (typeof error !== 'string') {
    error = String(error)
  }

  if (state.error) {
    return <div className={styles.offline}>Error: {error}</div>
  }

  return (
    <div className={styles.offline}>
      One of us is offline! Please try again later
    </div>
  )
}
