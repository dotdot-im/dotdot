import React from 'react'
import reactStringReplace from 'react-string-replace'

import { User } from 'store/types'

import styles from './index.module.scss'

const USER_REGEX = new RegExp('@([A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*_?)', 'gmi')
const URL_REGEX = new RegExp(
  /((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?)/,
  'gmi'
)

export const parseContent = (message: string, onlineUsers: User[]): React.ReactNodeArray => {
  let messageContent = reactStringReplace(
    message,
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

  return messageContent
}