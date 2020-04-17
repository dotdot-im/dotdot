import diff from 'fast-diff'

import { dateDiff } from "lib/dateDiff"
import { TimedChange } from "../"

export function timedDiff(currentValue: string, previousValue: string, lastKeyStroke: Date | null): TimedChange[] | null {
  const diffs = diff(previousValue, currentValue)

  let currentIndex = 0;
  const timedMessages: TimedChange[] = [];
  const timeDiff = lastKeyStroke ? dateDiff(lastKeyStroke) : 0;

  diffs.forEach(eachDiff => {
    if (eachDiff[0] === diff.EQUAL) {
      currentIndex += eachDiff[1].length
      return
    }
    timedMessages.push([
      currentIndex,
      eachDiff[0] === diff.INSERT ? eachDiff[1] : null,
      timeDiff
    ])
  })

  return timedMessages
}