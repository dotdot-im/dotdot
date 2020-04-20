import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

import styles from './index.module.scss'

type Props = {
  onHelp: () => void
  isCommand: boolean
  isPrivate: boolean
}

export default ({ onHelp, isCommand, isPrivate }: Props) => {
  let icon: IconProp = 'question-circle'
  if (isCommand) {
    icon = 'code'
  } else if (isPrivate) {
    icon = 'lock'
  }

  const handleClick = () => {
    if (icon !== 'question-circle') {
      return
    }
    onHelp()
  }

  return (
    <div className={styles.textIcon} onClick={handleClick}>
      <FontAwesomeIcon icon={icon} />
    </div>
  )
}
