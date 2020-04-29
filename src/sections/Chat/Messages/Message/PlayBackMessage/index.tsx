import React from 'react';

import { TimedChange } from 'sections/Chat/Footer/lib/timedDiff';

const MAX_DELAY = 1500
const PLAYBACK_SPEED = 1.25 // 1 is the recorded speed

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
  private timer: NodeJS.Timeout | null = null

  componentDidMount() {
    if (this.props.timers.length > 0) {
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

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  private nextAnimationStep() {
    const nextIndex = this.state.currentIndex + 1

    if (!this.props.timers[nextIndex]) {
      // invalid index
      return
    }

    this.setState({
      currentIndex: nextIndex,
      isAnimating: true
    }, () => {
      this.animationStep(nextIndex)
    })
  }

  private animationStep(step: number) {
    const [index, char, timer] = this.props.timers[step]

    this.timer = setTimeout(() => {
      const nextStepAvailable = step + 1 < this.props.timers.length

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
    }, Math.min(timer, MAX_DELAY) / PLAYBACK_SPEED)
  }

  private applyChangeToText(text: string, char: string | null, index: number) {
    if (text.length < 1 && char) {
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
        { this.state.shownText }
      </>
    );
  }
}

export default PlayBackMessage;
