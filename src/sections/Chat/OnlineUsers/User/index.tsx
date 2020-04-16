import React from 'react'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useGlobalState from 'store/state'
import { User } from 'store/types'

type Props = {
  user: User
}

export default ({ user }: Props) => {
  const { state } = useGlobalState()

  const isCurrentUser =
    state.auth.user && user.user_id === state.auth.user.user_id

  let iconName: IconName = 'circle'
  let inactive = ''

  // Set icon
  if (user.icon) {
    iconName = user.icon
  } else if (isCurrentUser) {
    iconName = 'dot-circle'
  }

  // Set status
  if (!user.isActive) {
    iconName = 'meh'
    inactive = ' (away)'
  }

  // TODO: Do we need this?
  let icon: IconProp = iconName
  if (isCurrentUser) {
    icon = ['far', iconName]
  }

  const userColor = user.contrastColor || `#${user.color}`

  return (
    <OverlayTrigger
      key={user.user_id}
      placement="bottom"
      overlay={
        <Tooltip id={`user-${user.user_id}`}>
          @{user.name}
          {inactive}
        </Tooltip>
      }
    >
      <FontAwesomeIcon style={{ color: userColor }} icon={icon} />
    </OverlayTrigger>
  )
}
