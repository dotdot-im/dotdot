import React, { useMemo, useEffect } from 'react'
import reactStringReplace from 'react-string-replace'
import ReactMarkdown from 'react-markdown'

import { User } from 'store/types'
import HelpMessage from '../HelpMessage'
import styles from './index.module.scss'
import Embed from './Embed'

type Props = {
  content: string
  isSystem: boolean
  onlineUsers: User[]
}

const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi')
const URL_REGEX = new RegExp(
  /((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?)/,
  'gmi'
)

export default ({ content, isSystem, onlineUsers }: Props) => {
  useEffect(() => {
    console.log('first render message content', content);
  }, [])
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

  const embeds = useMemo(() => {
    return urls.map(url => (
      <Embed
        key={ url }
        url={ url }
      />
    ))
  }, [urls])

  return (
    <div className={ styles.messageContent }>
      { messageContent }
      { embeds }
    </div>
  )
}
