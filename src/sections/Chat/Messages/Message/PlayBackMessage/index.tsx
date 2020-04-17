import React, { useState, useEffect, useCallback } from 'react';

import { TimedChange } from '../../../TextBox';
import { messageByMe } from 'stories/1-Message.stories';
import { useImmer } from 'use-immer';

const MAX_DELAY = 500

type Props = {
  timers: TimedChange[],
  message: string,
}

type State = {
  shownText: string
  currentIndex: number
  isAnimating: boolean
}

export class PlayBackMessage extends React.PureComponent<Props, State> {
  state: State = {
    shownText: '',
    currentIndex: -1,
    isAnimating: false
  }

  constructor(props: Props) {
    super(props)

    if (props.timers.length > 0) {
      this.nextAnimationStep()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.timers.length === this.props.timers.length ||
        this.props.timers.length < this.state.currentIndex ||
        this.state.isAnimating
    ) {
      return
    }

    this.nextAnimationStep()
  }

  private nextAnimationStep() {
    const nextIndex = this.state.currentIndex + 1
    console.log('animate the next step', nextIndex);

    if (!this.props.timers[nextIndex]) {
      // invalid index
      return
    }

    this.setState({
      currentIndex: nextIndex,
      isAnimating: true
    })

    const [index, char, timer] = this.props.timers[nextIndex]
    console.log('animate', index, char, timer)

    setTimeout(() => {
      const nextStepAvailable = nextIndex + 1 < this.props.timers.length

      if (!nextStepAvailable) {
        console.log('animation is finished!')
      }

      const updatedText = nextStepAvailable ?
        this.applyChangeToText(this.state.shownText, char, index) :
        this.props.message

      this.setState({
        shownText: updatedText,
        isAnimating: nextStepAvailable
      }, () => {
        if (nextStepAvailable) {
          this.nextAnimationStep()
        }
      })
    }, timer)
  }

  private applyChangeToText(text: string, char: string | null, index: number) {
    if (text.length < 1 && char) {
      console.log('empty text', text)
      return char
    }
    let newText = text
    const tmp = newText.split('')
    if (char === null) {
      tmp.splice(index, 1)
    } else {
      tmp.splice(index, 0, char)
    }
    newText = tmp.join('')
    return newText
  }

  public render() {
    return (
      <>
        <p>Animating: {JSON.stringify(this.state.isAnimating)} - { this.state.currentIndex }/{ this.props.timers.length }</p>
        <p>{ this.state.shownText }</p>
        <p>{ this.props.message }</p>
      </>
    );
  }
}

export default PlayBackMessage;
