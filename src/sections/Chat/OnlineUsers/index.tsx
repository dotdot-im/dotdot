import React from 'react'

import styles from './index.module.scss'
import useGlobalState from 'store/state'
import Dot from '../../../components/Dot'

export default () => {
  const { state } = useGlobalState()

  return (
    <div className={styles.onlineUsers}>
      <span className={styles.count}>{state.onlineUsers.length}</span>

      {state.onlineUsers.map((user) => (
        <Dot isOnline user={user} key={user.user_id} />
      ))}
    </div>
  )
}
