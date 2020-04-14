import React, { useEffect, useCallback, useState, useRef } from 'react'

const SCROLL_THRESHOLD = 250
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

  const onScrollDebounced = useCallback((isAtBottom: boolean) => {
    clearTimeout(scrollDebounce.current)

    if (onScrollChanged) {
      scrollDebounce.current = setTimeout(() => {
        onScrollChanged(isAtBottom)
      }, SCROLL_DEBOUNCE_DELAY)
    }
  }, [onScrollChanged])

  const scrollToBottom = useCallback(() => {
    if (!boxRef || !boxRef.current) {
      return
    }

    const scrollHeight = boxRef.current.scrollHeight - boxRef.current.offsetHeight
    boxRef.current.scrollTop = scrollHeight

    setScrollTop(boxRef.current.scrollTop)
    onScrollDebounced(true)
  }, [boxRef, onScrollDebounced, setScrollTop])

  const updateScrollState = useCallback((shouldScroll: boolean) => () => {
    if (!boxRef || !boxRef.current) {
      return
    }

    if (scrollTop > 0) {
      const customThreshold = threshold || SCROLL_THRESHOLD
      if (scrollTop > 0 && Math.abs(boxRef.current.scrollTop - scrollTop) > customThreshold) {
         // we are not at the bottom of the page, so we won't do anything
        onScrollDebounced(false)
        return
      } else {
        onScrollDebounced(true)
      }
    }

    if (shouldScroll) {
      scrollToBottom()
    }
  }, [boxRef, onScrollDebounced, threshold, scrollToBottom, scrollTop])

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
