import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

import styles from './index.module.scss'

type Props = {
  disabled: boolean
}

export default ({ disabled }: Props) => (
  <Button className={styles.button} type="submit" disabled={disabled}>
    <FontAwesomeIcon icon="paper-plane" />
  </Button>
)
