import React from 'react'
import logo from 'assets/img/dotdot.svg'

import Wrapper from '../Wrapper'

import styles from './index.module.scss'
import PasswordLock from '../Session'

export default () => {
  return (
    <header className={styles.header}>
      <Wrapper>
        <img className={styles.logo} src={logo} alt="dotdot logo" />

        <div className={styles.badge}>
          <PasswordLock />
        </div>
      </Wrapper>
    </header>
  )
}
