import React, { useState, useEffect, useCallback } from 'react';

import { TimedMessage } from '../..';
import { messageByMe } from 'stories/1-Message.stories';

const MAX_DELAY = 500

type Props = {
  timers: TimedMessage[],
  message: string,
}

export default (props: Props) => {
  const [ shownText, setText ] = useState<string>('')
  const [ currentIndex, setLastIndex ] = useState<number>(0)
  const [ isAnimating, setIsAnimating ] = useState<boolean>(false)

  const updateText = useCallback(() => {
    const timedMessage = props.timers[currentIndex]

    if (shownText.length >= props.message.length) {
      console.log('HANDBRAKE, WTF')
      setIsAnimating(false)
      return
    }

    if (!timedMessage) {
      console.log('queued non existing message');
      return
    }

    const index = timedMessage[0]
    const char = timedMessage[1]
    const timer = Math.min(timedMessage[2], MAX_DELAY)

    let newText = shownText
    if (char === null) {
      const tmp = newText.split('')
      tmp.splice(index, 1)
      newText = tmp.join('')
    } else {
      newText += char
    }

    console.log('animate', index, char, timer);
    console.log('new text', newText);

    setTimeout(() => {
      setText(newText)

      const nextIndex = currentIndex + 1

      if (props.timers[nextIndex]) {
        console.log('queue next char', props.timers[nextIndex]);

        setLastIndex(nextIndex)
        setTimeout(() => {
          updateText()
        })
      } else {
        setIsAnimating(false)
        console.log('finished animation', props.timers.length, nextIndex);
      }
    }, timer)
  }, [currentIndex, props.timers, props.message, shownText, setIsAnimating])

  useEffect(() => {
    if (props.timers.length <= currentIndex || isAnimating) {
      return
    }

    setIsAnimating(true)

    console.log('start updating text', isAnimating);

    updateText()

  }, [currentIndex, props.timers, updateText, setIsAnimating, isAnimating])

  return (
    <>
      <p>Animating { currentIndex }/{ props.timers.length }</p>
      <p>{ shownText }</p>
      <p>{ props.message }</p>
    </>
  );
}