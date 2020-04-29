import React from 'react'
import smoothscroll from 'smoothscroll-polyfill'

smoothscroll.polyfill()

const SCROLL_THRESHOLD = 50
const SCROLL_DEBOUNCE_DELAY = 150

type Props = {
  onScrollChanged?: (isAtBottom: boolean) => void,
  boxRef: React.RefObject<HTMLElement | null>,
  threshold?: number,
  children?: any,
}

type State = {
  stayAtBottom: boolean
  height: number
}

/**
 * Automatic Scroller for any container
 *
 * Algorithm outline:
 *   1. On Mount, scroll to bottom if possible
 *      - scrollTop = scrollHeight
 *      - stayAtBottom = true
 *      - height = scrollHeight
 *   2. On Update (children have changed)
 *      - if scrollHeight != height -> the container is now bigger
 *          - height = scrollHeight
 *          - if stayAtBottom = true -> autoScroll
 *          - if stayAtBottom = false -> nothing (fire onScrollChanged)
 *   3. On Scroll
 *      This event can be triggered by the user scrolling, or by the autoScroll going to the bottom
 *      But all cases are the same:
 *      - if scrollTop < scrollheight -> User scrolled UP
 *          - stayAtBottom = false (no longer stick to the bottom)
 *      - else // this means that the user or the autoScroll scrolled to the bottom
 *          - stayAtBottom = true
 */
export default class ScrollBox extends React.PureComponent<Props, State> {
  private scrollDebounceTimer: any
  private scrollListenerSetup: boolean = false

  state: State = {
    stayAtBottom: true,
    height: 0,
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.boxRef !== this.props.boxRef ||
        prevProps.boxRef.current !== this.props.boxRef.current) {
      this.setupListener(true)
    }
    this.setupListener()

    setTimeout(() => {
      const { boxRef } = this.props
      if (!boxRef.current) {
        return;
      }
      const height = boxRef.current.scrollHeight;
      if (height !== this.state.height) {
        this.setState({
          height
        })
        this.onScroll(true)
      }
    })
  }

  componentDidMount() {
    window.addEventListener("resize", this.scrollToBottom, true);

    setTimeout(() => {
      this.scrollToBottom()
    }, 250)
  }

  componentWillUnmount() {
    const { boxRef } = this.props

    if (boxRef && boxRef.current) {
      boxRef.current.removeEventListener('scroll', this.onScrollDebounced)
    }

    window.removeEventListener("resize", this.scrollToBottom);
  }

  /**
   * Event handler for scroll events on the component
   * Used to debounce them every SCROLL_DEBOUNCE_DELAY
   * for performance.
   * The only point of this is to call props.onScrollChanged
   * and tell it whether it's at the bottom or not
   */
  private onScrollDebounced = () => {
    clearTimeout(this.scrollDebounceTimer)

    this.scrollDebounceTimer = setTimeout(() => {
      this.onScroll(false)
    }, SCROLL_DEBOUNCE_DELAY)
  }

  /**
   * onScroll event handler
   *
   * It will check if we're at the bottom, and if not and we're meant to scroll to the bottom,
   * it will go there.
   */
  private onScroll = (shouldScroll: boolean) => {
    const { onScrollChanged, boxRef, threshold } = this.props

    if (!boxRef || !boxRef.current) {
      return
    }

    const scrollHeight = boxRef.current.scrollHeight - boxRef.current.offsetHeight
    const customThreshold = threshold || SCROLL_THRESHOLD
    const isAtBottom = Math.abs(boxRef.current.scrollTop - scrollHeight) < customThreshold

    if (shouldScroll && this.state.stayAtBottom) {
      this.scrollToBottom()
    }

    if (!shouldScroll) {
      this.setState({
        stayAtBottom: isAtBottom
      })

      // Notify of scroll changes
      onScrollChanged && onScrollChanged(isAtBottom)
    }
  }

  /**
   * Automatically scroll all the way tot he bottom
   */
  private scrollToBottom = () => {
    const { boxRef, onScrollChanged } = this.props

    if (!boxRef || !boxRef.current) {
      return
    }

    const scrollHeight = boxRef.current.scrollHeight - boxRef.current.offsetHeight
    boxRef.current.scroll({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth'
    });

    this.setState({
      stayAtBottom: true
    })

    onScrollChanged && onScrollChanged(true)
  }

  private setupListener(override: boolean = false) {
    const { boxRef } = this.props

    if (this.scrollListenerSetup && !override) {
      return
    }

    if (boxRef && boxRef.current) {
      this.scrollListenerSetup = true
      boxRef.current.addEventListener('scroll', this.onScrollDebounced, true)
    }
  }

  render() {
    return (
      <>
        { this.props.children }
      </>
    )
  }
}