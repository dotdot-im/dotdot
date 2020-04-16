import { dateDiff } from "lib/dateDiff"
import { TimedMessage } from "../"

export function timedDiff(currentValue: string, previousValue: string, lastKeyStroke: Date | null): TimedMessage | null {
  if (Math.abs(currentValue.length - previousValue.length) !== 1) {
    return null
  }

  // ok so potentially only one character changed, lets make sure
  let changeIndex = -1
  for (let i = 0; i < currentValue.length; i++) {
    if (currentValue[i] !== previousValue[i]) {
      changeIndex = i
      break
    }
  }

  if (changeIndex === currentValue.length - 1) {
    // TODO continue here
  }

  const timeDiff = lastKeyStroke ? dateDiff(lastKeyStroke) : 0
  if (currentValue.length > previousValue.length) {
    // adding
    return [currentValue[currentValue.length - 1], timeDiff]
  }

  return [null, timeDiff]
}