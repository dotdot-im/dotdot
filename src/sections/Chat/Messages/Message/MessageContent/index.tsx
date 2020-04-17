import React from 'react'

import { User } from 'store/types'
import HelpMessage from '../HelpMessage'
import { parseContent } from '../lib/parseContent'

type Props = {
  content: string
  isSystem: boolean
  onlineUsers: User[]
}

export default ({ content, isSystem, onlineUsers }: Props) => {
  let messageContent: React.ReactNodeArray | JSX.Element | string = content

  if (isSystem && content === '/help') {
    messageContent = <HelpMessage />
  } else {
    // replace mentions with colored version
    messageContent = parseContent(content, onlineUsers)
  }

  return (
    <div>
      { messageContent }
    </div>
  )
}
