import { getRgbLuminance } from './getRgbLuminance'
import { hex2Rgb } from './hex2rgb'
import { pSBC } from './psbc'

/**
 * Takes a HEX string (with or without pound) and returns a colour visible in the theme background
 */
export const makeColorReadable = (color: string) => {
  const colorRgb = hex2Rgb(color)
  const lightMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches

  if (!colorRgb) return '#0000FF' // fail

  const lum = getRgbLuminance(colorRgb.r, colorRgb.g, colorRgb.b)
  let offset = 0
  // Only change color if luminance difference in the 50% range to theme
  if (lightMode && lum >= 0.5) offset = -lum
  else if (!lightMode && lum < 0.5) offset = lum + 0.2

  /*
  // !Demo
  // Make sure to replicate the formula changes you do above, here
  const forLight = lum >= 0.5 ? pSBC(-lum, color, '#000000') : color
  const forDark = lum < 0.5 ? pSBC(lum + 0.2, color, '#ffffff') : color
  // Current on dark
  console.log(
    `%c (${forDark !== color ? '<' : '='}) @jaicab ☃ ★ ♖`,
    `background:#293134; color: ${color}; display: block; padding: 1em; font-size: 1.5em`
  )
  // New on dark
  if (forDark !== color)
    console.log(
      `%c (>) @jaicab ☃ ★ ♖`,
      `background:#293134; color: ${forDark}; display: block; padding: 1em; font-size: 1.5em`
    )
  // Current on light
  console.log(
    `%c (${forLight !== color ? '<' : '='}) @jaicab ☃ ★ ♖`,
    `background:#fcfcfc; color: ${color}; display: block; padding: 1em; font-size: 1.5em`
  )
  // New on light
  if (forLight !== color)
    console.log(
      '%c (>) @jaicab ☃ ★ ♖',
      `background:#fcfcfc; color: ${forLight}; display: block; padding: 1em; font-size: 1.5em`
    )
  */

  return offset ? pSBC(offset, color) || color : color
}
