import { VALID_USERNAME } from '../constants'

// Detects actions based on message string on input

const isCommand = (val: string) => val[0] === '/'
const isPm = (val: string) => val[0] === '@'

export const getMessageKind = (val: string) => {
  if (isCommand(val)) return 'command'
  if (isCommand(val)) return 'private'
  return false
}

export const getMessagePmTo = (val: string) => {
  const words = val.split(' ')

  if (
    words.length > 0 &&
    words[0][0] === '@' &&
    VALID_USERNAME.test(words[0].substr(1))
  ) {
    return words[0].substr(1)
  }

  return null
}
