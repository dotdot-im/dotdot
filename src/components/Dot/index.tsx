import React from 'react'
import { IconProp, IconName } from '@fortawesome/fontawesome-svg-core'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useGlobalState from 'store/state'
import { User } from 'store/types'

type Props = {
  user: User
  isDraft?: boolean
  isPrivate?: boolean
  isOnline?: boolean
  pointOp?: boolean
  showOverlay?: boolean
}

export default ({
  user,
  isDraft = false,
  isPrivate = false,
  isOnline = true,
  showOverlay = false,
  pointOp = false,
}: Props) => {
  const { state } = useGlobalState()

  const isCurrentUser =
    state.auth.user && user.user_id === state.auth.user.user_id
  const isSystem = user.user_id === 'dotdot'
  const userColor = user.contrastColor || `#${user.color}`

  let iconName: IconName = 'circle'
  let inactive = ''

  // Icon name
  if (isSystem) {
    iconName = 'cog'
  } else if (isDraft) {
    iconName = 'circle-notch'
  } else if (isPrivate) {
    iconName = 'lock'
  } else if (!isOnline || !user.isActive) {
    iconName = 'meh'
  } else if (isCurrentUser && pointOp) {
    iconName = 'dot-circle'
  } else if (user.icon) {
    iconName = user.icon
  }

  if (!user.isActive) {
    inactive = ' (away)'
  }

  // Set to far for other users
  let icon: IconProp = iconName
  if (isCurrentUser && !isPrivate && !isDraft) {
    icon = ['far', iconName]
  }

  const Icon = () => (
    <FontAwesomeIcon
      style={{ color: userColor }}
      icon={icon}
      spin={isDraft && !isPrivate}
    />
  )

  const IconWithOverlay = () => (
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
      <Icon />
    </OverlayTrigger>
  )

  return showOverlay ? <IconWithOverlay /> : <Icon />
}
