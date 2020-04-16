import React from 'react'
import logo from 'assets/img/dotdot.svg'

import Wrapper from '../Wrapper'

import styles from './index.module.scss'
import PasswordLock from '../Session'
import OnlineUsers from '../OnlineUsers'

type Props = {
  scrollingWhileFocused?: boolean
}

export default ({ scrollingWhileFocused }: Props) => {
  const topPosition = scrollingWhileFocused ? window.pageYOffset + 'px' : 0

  return (
    <header className={styles.header} style={{ top: topPosition }}>
      <Wrapper>
        <img className={styles.logo} src={logo} alt="dotdot logo" />

        <div className={styles.online}>
          <OnlineUsers />
        </div>

        <div className={styles.badge}>
          <PasswordLock />
        </div>
      </Wrapper>
    </header>
  )
}
