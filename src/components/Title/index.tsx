import React, { useEffect, useContext, useCallback } from 'react'
import Helmet from 'react-helmet'
import useSound from 'use-sound'
import { useImmer } from 'use-immer'

import { SocketContext } from 'util/socketProvider'
import { Message } from 'store/types'
import useGlobalState from 'store/state'
import newMessageSound from 'assets/sounds/newMessage.mp3'
import { dateDiff } from 'lib/dateDiff'

const TIME_BETWEEN_SOUND = 5 * 1000 // ms
const NOTIFICATION_VOLUME = 0.5 // 0-1

type State = {
  lastSound: Date | null,
  windowFocused: boolean,
  titleNotification: boolean,
}

export default () => {
  const { state } = useGlobalState();
  const [ localState, setState ] = useImmer<State>({
    lastSound: new Date(),
    windowFocused: true,
    titleNotification: false,
  })

  const { socket } = useContext(SocketContext)
  const [ play ] = useSound(newMessageSound, {
    interrupt: true,
    volume: NOTIFICATION_VOLUME,
  });

  const onMessage = useCallback((user_id: string) => (msg: Message) => {
    if (msg.attributes.draft || user_id === msg.user.user_id) {
      return
    }

    setState(draft => {
      if (!draft.windowFocused) {
        draft.titleNotification = true;

        if (!draft.lastSound || dateDiff(draft.lastSound) > TIME_BETWEEN_SOUND) {
          draft.lastSound = new Date()
          play({})
        }
      }
    })
  }, [setState, play])

  const onFocus = useCallback(() => {
    setState(draft => {
      draft.titleNotification = false
      draft.windowFocused = true
    })
  }, [setState])

  const onBlur = useCallback(() => {
    setState(draft => {
      draft.windowFocused = false
    })
  }, [setState])

  const user_id = state.auth.user ? state.auth.user.user_id : null

  useEffect(() => {
    if (!socket || !user_id) {
      return
    }
    socket.on('message', onMessage(user_id))
  }, [socket, onMessage, user_id])

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [onFocus, onBlur])

  return (
    <Helmet>
      <title>{localState.titleNotification ? '•• dotdot' : 'dotdot'}</title>
    </Helmet>
  )
}
