
import { LogLevel } from './types'

export { join } from './join'
export { split } from './split'

export * from './log'
export * from './log.initial'
export * from './types'

export const DEBUG = LogLevel.DEBUG
export const INFO = LogLevel.INFO
export const LOG = LogLevel.LOG
export const WARN = LogLevel.WARN
export const ERROR = LogLevel.ERROR
