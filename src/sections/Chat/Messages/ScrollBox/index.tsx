import React, { useEffect, useCallback, useState, useRef } from 'react'
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

export default ({ boxRef, onScrollChanged, threshold, children }: Props) => {
  const [ scrollTop, setScrollTop ] = useState<number>(-1);
  const [ height, setHeight ] = useState<number>(0);
  const scrollDebounce = useRef<any>(null)

  // Debounced method to fire on scroll, to make it more performant
  const onScrollDebounced = useCallback((isAtBottom: boolean) => {
    clearTimeout(scrollDebounce.current)

    if (onScrollChanged) {
      scrollDebounce.current = setTimeout(() => {
        console.log('SCROLL CHANGED', isAtBottom);
        onScrollChanged(isAtBottom)
      }, SCROLL_DEBOUNCE_DELAY)
    }
  }, [onScrollChanged])

  // Automatically scroll to the bottom of the screen
  const scrollToBottom = useCallback(() => {
    if (!boxRef || !boxRef.current) {
      return
    }

    const scrollHeight = boxRef.current.scrollHeight - boxRef.current.offsetHeight
    boxRef.current.scroll({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth'
    });

    setScrollTop(boxRef.current.scrollTop)
    onScrollDebounced(true)
  }, [boxRef, onScrollDebounced, setScrollTop])

  // Update based on whether the scrollbar is at the bottom or not
  const updateScrollState = useCallback((shouldScroll: boolean) => () => {
    if (!boxRef || !boxRef.current) {
      return
    }

    const scrollHeight = boxRef.current.scrollHeight - boxRef.current.offsetHeight
    const customThreshold = threshold || SCROLL_THRESHOLD
    const isAtBottom = Math.abs(boxRef.current.scrollTop - scrollHeight) < customThreshold
    const hasUserScrolled = Math.abs(boxRef.current.scrollTop - scrollTop) < customThreshold

    onScrollDebounced(isAtBottom)

    if (shouldScroll && !hasUserScrolled) {
      scrollToBottom()
    }
  }, [boxRef, onScrollDebounced, threshold, scrollToBottom, scrollTop])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("resize", scrollToBottom, true);

    if (boxRef && boxRef.current) {
      boxRef.current.addEventListener('scroll', updateScrollState(false), true)
    }

    // cleanup
    return () => {
      window.removeEventListener("resize", scrollToBottom, true);
    }
  }, [boxRef, scrollToBottom, updateScrollState])

  // Recalculate when the element children change
  // TODO Might be better to run on resize, but not sure if resize will fire when things are added
  useEffect(() => {
    // when the children changes, recalculate
    if (!boxRef.current) {
      return;
    }
    const newHeight = boxRef.current.scrollHeight;
    if (newHeight !== height) {
      setHeight(newHeight)
      updateScrollState(true)()
    }
  }, [boxRef, height, updateScrollState, children])

  return (
    <>
      { children }
    </>
  )
}
