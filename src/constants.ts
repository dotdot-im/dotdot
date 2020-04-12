export const API_URL = process.env.REACT_APP_API_URL || 'https://api.dotdot.im'
export const VALID_USERNAME = /^[A-Za-z0-9]+(?:[ _][A-Za-z0-9]+)*_?$/i
export const CAPTCHA_PROVIDER = process.env.REACT_APP_CAPTCHA_PROVIDER || 'recaptcha'
export const CAPTCHA_KEY = process.env.REACT_APP_CAPTCHA_KEY || ''
export const MAX_MESSAGE_HISTORY = 100
