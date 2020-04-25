import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'

import styles from './index.module.scss'

type Props = {
  onHelp: () => void
  kind: 'private' | 'command' | false
}

export default ({ onHelp, kind }: Props) => {
  let icon: IconProp = 'question-circle'
  if (kind === 'command') {
    icon = 'code'
  } else if (kind === 'private') {
    icon = 'eye-slash'
  }

  const handleClick = () => {
    if (icon !== 'question-circle') {
      return
    }
    onHelp()
  }

  return (
    <div
      className={classNames(styles.textIcon, {
        [styles.interactive]: kind === false,
        [styles.private]: kind === 'private',
        [styles.command]: kind === 'command',
      })}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  )
}
