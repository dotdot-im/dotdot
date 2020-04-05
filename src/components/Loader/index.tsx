import React from 'react'
import Logo from 'components/Logo'

type Props = {
  text?: string | null
}

export default (props: Props) => {
  return (
    <>
      <Logo infinite />
    </>
  )
}
