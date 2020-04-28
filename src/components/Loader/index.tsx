import React from 'react'
import LogoAnimation from 'components/LogoAnimation'

type Props = {
  text?: string | null
}

export default (props: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
      }}
    >
      <LogoAnimation infinite />
    </div>
  )
}
