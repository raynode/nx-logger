
import * as util from 'util'
import {
  Config,
  Message,
} from './types'

// checks if some thing is a string
export const isString = (obj: any): obj is string => typeof obj === 'string'

// formats a string with arguments into a human readable format
export const formatter = (format: string, args: any[]) => util.format(format, ...args)

// formats anything into a readable format
export const inspect = (object: any, options?: any) =>
  isString(object) ? object : util.inspect(object, {
    depth: 2,
    maxArrayLength: 5,
    ...options,
  })

//
export const selectProperty = <K extends keyof Config>(property: K) =>
  (base: Config, extra: Partial<Config>) =>
    extra && extra.hasOwnProperty(property) ? extra[property] : base[property]

export const formatMessage = (messages: Message[]): Message => {
  const [ format, ...args ] = messages
  return messages.length > 1 ? formatter(format, args) : inspect(messages[0])
}
