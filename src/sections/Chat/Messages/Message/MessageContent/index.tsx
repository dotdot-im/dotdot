import React, { useMemo } from 'react'

import { User } from 'store/types'
import HelpMessage from '../HelpMessage'
import { parseContent, URL_REGEX } from '../lib/parseContent'
import Embed from './Embed'

type Props = {
  content: string
  isSystem: boolean
  onlineUsers: User[]
}

export default ({ content, isSystem, onlineUsers }: Props) => {
  let messageContent: React.ReactNodeArray | JSX.Element | string = content
  const urls: string[] = []

  if (isSystem && content === '/help') {
    messageContent = <HelpMessage />
  } else {
    // find urls for embeds
    const matches = messageContent.match(URL_REGEX)
    if (matches) {
      matches.forEach(url => {
        if (!urls.includes(url)) {
          urls.push(url)
        }
      })
    }

    // replace mentions with colored version
    messageContent = parseContent(content, onlineUsers)
  }

  const embeds = useMemo(() => {
    return urls.map(url => (
      <Embed
        key={ url }
        url={ url }
      />
    ))
  }, [urls])

  return (
    <div>
      { messageContent }
      { embeds }
    </div>
  )
}
