import React, { useState, useEffect } from 'react'
import reactStringReplace from 'react-string-replace'

import { User } from 'store/types'
import HelpMessage from '../HelpMessage'
import styles from './index.module.scss'

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
  let messageContent: React.ReactNodeArray | JSX.Element | string = content

  if (isSystem && content === '/help') {
    messageContent = <HelpMessage />
  } else {
    // replace mentions with colored version
    messageContent = reactStringReplace(
      messageContent,
      USER_REGEX,
      (username, index) => {
        let style = {}
        const userIndex = onlineUsers.findIndex(
          (user) => user.name === username
        )
        if (userIndex > -1) {
          const userColor = onlineUsers[userIndex].contrastColor || '#' + onlineUsers[userIndex].color
          style = {
            color: userColor,
          }
        }
        return (
          <span key={index} className={styles.mention} style={style}>
            @{username}
          </span>
        )
      }
    )
    // auto-link urls
    messageContent = reactStringReplace(messageContent, URL_REGEX, (url) => {
      return (
        <a key={url} href={url} rel="noopener noreferrer" target="_blank">
          {url}
        </a>
      )
    })
  }

  return (
    <div className={ styles.messageContent }>
      { messageContent }
    </div>
  )
}
