
import * as util from 'util'
import {
  ChildConfiguration,
  Config,
  Message,
} from './types'

// checks if some thing is a string
export const isString = (obj: any): obj is string => typeof obj === 'string'

// formats a string with arguments into a human readable format
export const formatter = (format: string, args: any[]) => util.format(format, ...args)

// formats anything into a readable format
export const inspect = (object: any) =>
  isString(object) ? object : util.inspect(object, {
    depth: 2,
    maxArrayLength: 5,
  })

// formatter switch to choose ::formatter or ::inspect
export const formatMessage = (messages: Message[]): Message => {
  const [ format, ...args ] = messages
  return messages.length > 1 ? formatter(format, args) : inspect(messages[0])
}

// function to select some property from a Partial configuration or selecting the one from the base
export const selectProperty = <K extends keyof Config>(property: K) =>
  (base: Config, extra: ChildConfiguration) =>
    !extra || !extra.hasOwnProperty(property)
      ? base[property]
      : extra[property]

// function to merge namespaces of 2 configurations
export const mergeNamespace = (base: Config, extra?: Partial<Config>) =>
  [...base.namespace, ...(extra && extra.namespace || [])]
