import React from 'react'
import reactStringReplace from 'react-string-replace'
import ReactMarkdown from 'react-markdown'

import { User } from 'store/types'

import styles from './index.module.scss'

export const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi')
export const URL_REGEX = new RegExp(
  /((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?)/,
  'gmi'
)

export const parseContent = (message: string, onlineUsers: User[]): React.ReactNodeArray => {
  return reactStringReplace(
    message,
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