import React from 'react'

import '../lib/icons'
import '../assets/scss/index.scss'

import Footer from 'sections/Chat/Footer'

export default { title: 'Footer' }

export const normal = () => {
  return <Footer isFocused={false} onFocus={() => {}} onBlur={() => {}} />
}
