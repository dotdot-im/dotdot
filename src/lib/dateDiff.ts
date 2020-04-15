/**
 * Get the difference between two date objects in ms
 */
export const dateDiff = (t1: Date, t2: Date = new Date()) => {
  return t2.getTime() - t1.getTime();
}