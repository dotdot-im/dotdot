import React from 'react'

import Logo from 'components/Logo'
import Wrapper from '../Wrapper'

import styles from './index.module.scss'
import PasswordLock from '../Session'
import OnlineUsers from '../OnlineUsers'

type Props = {
  scrollingWhileFocused?: boolean
}

export default ({ scrollingWhileFocused }: Props) => {
  const top = scrollingWhileFocused ? window.pageYOffset + 'px' : 0
  const position = scrollingWhileFocused ? 'absolute' : 'fixed'

  return (
    <header className={styles.header} style={{ position, top }}>
      <Wrapper>
        <Logo className={styles.logo} />

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
