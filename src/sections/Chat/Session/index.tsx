import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import useGlobalState from 'store/state'

import UserBadge from './UserBadge'
import AdminBadge from './AdminBadge'
import PasswordModal from './PasswordModal'

type Props = {
  children?: React.ReactNode
}

export default ({ children }: Props) => {
  const { state, dispatch } = useGlobalState()

  const [isOpen, setModalOpen] = useState<boolean>(false)

  const handleClick = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)

  let tooltipText = 'Set a password to keep your username'

  if (state.auth.user && state.auth.user.hasPassword) {
    tooltipText = 'Change your password'
  }

  return (
    <>
      {state.auth.user && state.auth.user.isAdmin && <AdminBadge />}
      <OverlayTrigger
        placement="bottom"
        delay={500}
        overlay={<Tooltip id="passwordLock">{tooltipText}</Tooltip>}
      >
        <UserBadge onClick={handleClick} />
      </OverlayTrigger>

      <PasswordModal show={isOpen} onHide={handleClose} />
    </>
  )
}
