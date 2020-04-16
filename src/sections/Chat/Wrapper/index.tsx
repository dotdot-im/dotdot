import React from 'react'

import styles from './index.module.scss'

type Props = {
  children: React.ReactNode
}

export default ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>
}
