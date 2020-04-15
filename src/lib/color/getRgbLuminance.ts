/**
 * Calculates luminance for { r, g, b } passed
 * Returns value 0-1
 */
export const getRgbLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(function (v) {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}
