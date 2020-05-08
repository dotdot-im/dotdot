import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'

export default () => (
  <a
    className={styles.badge}
    href="/admin"
    title="Monitoring"
    style={{ marginLeft: '1em' }}
  >
    <FontAwesomeIcon className={styles.icon} icon="shield-alt" />
  </a>
)
