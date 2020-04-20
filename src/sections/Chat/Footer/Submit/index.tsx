import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

import styles from './index.module.scss'

export default () => (
  <Button className={styles.button} type="submit">
    <FontAwesomeIcon icon="paper-plane" />
  </Button>
)
