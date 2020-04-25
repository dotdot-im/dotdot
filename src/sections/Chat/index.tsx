import React, { useEffect, useCallback } from 'react'
import classNames from 'classnames'
import smoothscroll from 'smoothscroll-polyfill'

import { useGlobalState } from 'store/state'
import Loader from 'components/Loader'

import styles from './index.module.scss'
import Header from './Header'
import Messages from './Messages'
import Footer from './Footer'
import { useImmer } from 'use-immer'
import { Message } from 'store/types'

// fix for browser with no smooth scrolling
smoothscroll.polyfill()

type State = {
  scrollingWhileFocused: boolean
  replyTo: Message | null
}

export default () => {
  const { state } = useGlobalState()
  const [localState, setState] = useImmer<State>({
    scrollingWhileFocused: false,
    replyTo: null,
  })

  const onMessageClick = useCallback(
    (messageTimestamp: number) => {
      setState((draft) => {
        const messageReply =
          state.messages.find(
            (eachMessage) =>
              eachMessage.timestamp.getTime() === messageTimestamp
          ) || null
        console.log('replying to ', messageReply)
        draft.replyTo = messageReply
      })
    },
    [state.messages, setState]
  )

  const cancelReply = useCallback(() => {
    setState((draft) => {
      draft.replyTo = null
    })
  }, [setState])

  // On window scroll
  const setHeaderPosition = useCallback(() => {
    setState((draft) => {
      if (state.chat.focused) {
        draft.scrollingWhileFocused = true
      }
    })
    // eslint-disable-next-line
  }, [setState])

  useEffect(() => {
    window.addEventListener('scroll', setHeaderPosition, true)

    return () => {
      window.removeEventListener('scroll', setHeaderPosition)
    }
  }, [setHeaderPosition])

  useEffect(() => {
    if (state.chat.focused) {
      setHeaderPosition()
    } else {
      setState((draft) => {
        draft.scrollingWhileFocused = false
      })
    }
  }, [setState, setHeaderPosition, state.chat.focused])

  if (!state.socket.connected) {
    return <Loader />
  }

  return (
    <div
      className={classNames(styles.chat, {
        [styles.scrollingChat]: localState.scrollingWhileFocused,
      })}
    >
      <Header scrollingWhileFocused={localState.scrollingWhileFocused} />

      <Messages onMessageClick={onMessageClick} />

      <Footer replyTo={localState.replyTo} onCancelReply={cancelReply} />
    </div>
  )
}
