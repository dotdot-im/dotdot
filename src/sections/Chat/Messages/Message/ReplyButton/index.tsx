import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

import styles from './index.module.scss'

type Props = {
  onClick: () => void
}

export default ({ onClick }: Props) => (
  <Button
    className={styles.button}
    variant="link"
    onClick={onClick}
    title="Reply to this message"
  >
    <FontAwesomeIcon icon="reply" />
    <span className={styles.text}>Reply</span>
  </Button>
)
