import React from 'react'
import logoBlack from 'assets/img/logo-black.svg'
import logoWhite from 'assets/img/logo-white.svg'

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
  const logo = window.matchMedia('(prefers-color-scheme: light)').matches
    ? logoBlack
    : logoWhite

  return (
    <header className={styles.header} style={{ position, top }}>
      <Wrapper>
        <img className={styles.logo} srcSet={logo} alt="dotdot logo" />

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
