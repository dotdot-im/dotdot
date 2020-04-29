import React from 'react'

import Logo from 'components/Logo'

import styles from './index.module.scss'
import Session from '../Session'
import OnlineUsers from '../OnlineUsers'
import { Container } from 'react-bootstrap'

type Props = {
  scrollingWhileFocused?: boolean
}

export default ({ scrollingWhileFocused }: Props) => {
  const top = scrollingWhileFocused ? window.pageYOffset + 'px' : 0
  const position = scrollingWhileFocused ? 'absolute' : 'fixed'

  return (
    <header className={styles.header} style={{ position, top }}>
      <Container fluid className={styles.container}>
        <Logo className={styles.logo} />

        <div className={styles.online}>
          <OnlineUsers />
        </div>

        <div className={styles.badge}>
          <Session />
        </div>
      </Container>
    </header>
  )
}
