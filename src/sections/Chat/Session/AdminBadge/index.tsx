import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import styles from './index.module.scss'

export default () => (
  <Link
    className={styles.badge}
    to="/admin"
    title="Monitoring"
    style={{ marginLeft: '1em' }}
  >
    <FontAwesomeIcon className={styles.icon} icon="shield-alt" />
  </Link>
)
