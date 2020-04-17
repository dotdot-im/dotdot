import diff from 'fast-diff'

import { dateDiff } from "lib/dateDiff"
import { TimedChange } from "../"

export function timedDiff(currentValue: string, previousValue: string, lastKeyStroke: Date | null): TimedChange[] | null {
  const diffs = diff(previousValue, currentValue)

  let currentIndex = 0;
  const timedMessages: TimedChange[] = [];
  const timeDiff = lastKeyStroke ? dateDiff(lastKeyStroke) : 0;

  for (const eachDiff of diffs) {
    if (eachDiff[0] === diff.EQUAL) {
      currentIndex += eachDiff[1].length
      continue
    }
    if (eachDiff[0] === diff.DELETE && eachDiff[1].length > 1) {
      // at least for now, deleting more than one character will
      // just reset the animation to simplify the process
      return null
    }
    timedMessages.push([
      currentIndex,
      eachDiff[0] === diff.INSERT ? eachDiff[1] : null,
      timeDiff
    ])
  }

  return timedMessages
}