import React from 'react'

import 'lib/icons'
import '../assets/scss/index.scss'

import TextBox from 'sections/Chat/TextBox'

export default { title: 'Text Box' }

export const normal = () => {
  return (
    <TextBox />
  );
}