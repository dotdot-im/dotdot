import React from 'react'
import reactStringReplace from 'react-string-replace'
import ReactMarkdown from 'react-markdown'

import { User } from 'store/types'
import HelpMessage from '../HelpMessage'
import styles from './index.module.scss'

type Props = {
  content: string
  isSystem: boolean
  onlineUsers: User[]
}

const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi')

export default ({ content, isSystem, onlineUsers }: Props) => {

  let messageContent: React.ReactNodeArray | JSX.Element | string = content

  if (isSystem && content === '/help') {
    messageContent = <HelpMessage />
  } else {
    // replace mentions with colored version
    messageContent = reactStringReplace(
      messageContent,
      USER_REGEX,
      (username, index) => {
        const style: React.CSSProperties = {}
        const user = onlineUsers.find(
          eachUser => eachUser.name === username
        )
        if (user) {
          style.color = user.contrastColor || '#' + user.color
        }
        return (
          <span key={index} className={styles.mention} style={style}>
            @{username}
          </span>
        )
      }
    ).map((content, index) => { // parse markdown
      if (typeof content !== 'string') {
        return content
      }
      return (
        <ReactMarkdown
          key={ index }
          source={ content }
          unwrapDisallowed={ true }
          allowedTypes={ ['text', 'link', 'blockquote', 'code', 'strong', 'emphasis', 'delete', 'image', 'inlineCode'] }
        />
      )
    })
  }

  return (
    <div className={ styles.messageContent }>
      { messageContent }
    </div>
  )
}
