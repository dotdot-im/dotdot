import { getRgbLuminance } from './getRgbLuminance'
import { hex2Rgb } from './hex2rgb'
import { pSBC } from './psbc'

type rgbColor = {
  r: number
  g: number
  b: number
}

const demoInConsole = (color: string, colorRgb: rgbColor) => {
  // Make sure to replicate the formula changes you do above, here
  const forLight = pSBC(getThemeOffset(colorRgb, true), color, '#000000')
  const forDark = pSBC(getThemeOffset(colorRgb, false), color, '#ffffff')
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
}

const getThemeOffset = (colorRgb: rgbColor, lightMode: boolean) => {
  const lum = getRgbLuminance(colorRgb.r, colorRgb.g, colorRgb.b)
  let offset = 0
  // Only change color if luminance difference in the 50% range to theme
  if (lightMode && lum >= 0.5) offset = -lum
  else if (!lightMode && lum < 0.5) offset = lum + 0.2

  return offset
}

/**
 * Takes a HEX string (with or without pound) and returns a colour visible in the theme background
 */
export const makeColorReadable = (color: string) => {
  const colorRgb = hex2Rgb(color) as rgbColor
  const isLightMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches

  if (!colorRgb) return '#0000FF' // fail

  const offset = getThemeOffset(colorRgb, isLightMode)
  const readableColor = offset && pSBC(offset, color)

  // !Demo
  // demoInConsole(color, colorRgb)

  return readableColor || color
}
