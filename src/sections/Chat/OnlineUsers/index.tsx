import React from 'react'

import styles from './index.module.scss'
import useGlobalState from 'store/state'
import User from './User'

export default () => {
  const { state } = useGlobalState()

  return (
    <div className={styles.onlineUsers}>
      <span className={styles.count}>{state.onlineUsers.length}</span>

      {state.onlineUsers.map((user) => (
        <User
          key={user.user_id}
          user={user}
        />
      ))}
    </div>
  )
}
