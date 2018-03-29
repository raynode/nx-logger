
import * as util from 'util'

export const isString = (obj: any): obj is string => typeof obj === 'string'

export enum LogLevel {
  DEBUG = 10,
  INFO = 7,
  LOG = 5,
  WARN = 3,
  ERROR = 1,
}

export const DEBUG = LogLevel.DEBUG
export const INFO = LogLevel.INFO
export const LOG = LogLevel.LOG
export const WARN = LogLevel.WARN
export const ERROR = LogLevel.ERROR

// define atomic types
export type Result = void
export type Namespace = string[]
export type MessageString = string
export type MessageObject = string
export type Message = MessageString | MessageObject
export interface LoggerFn {
  (message: any): Result
  (message: Message, ...messages: any[]): Result
}

// define config type
export interface Config {
  enabled: boolean
  namespace: Namespace
  transport: TransportFn
  tty: boolean
  verbosity: number
}

// define transport
export type TransportFn = (configuration: Config, messages: Message[], verbosity: number) => Result
export type Formatter = (format: string, args: any[]) => string
export type Inspect = (object: any, options?: any) => string

// define handler
export type Handler = <T>(callback: T, namespace?: string, config?: Partial<Config>) => T
export type HandlerFactory = (log: Log) => Handler

// define log function
export interface Log extends LoggerFn {
  readonly configuration: Config
  create: SimplyFactoryFn
  on: Handler
  error: LoggerFn
  warn: LoggerFn
  log: LoggerFn
  info: LoggerFn
  debug: LoggerFn
}

export type FactoryFn = (configuration: Partial<Config>) => Log
export type FactoryCreatorFn = (configuration: Config) => SimplyFactoryFn
export interface SimplyFactoryFn {
  (configuration: Partial<Config>): Log
  (...namespace: Namespace): Log
}
export type WriteFn = (configuration: Config, verbosity?: number) => LoggerFn
export type ConfigureFn = (options?: Partial<Config>) => Config

const formatter: Formatter = (format, args) => util.format(format, ...args)
const inspect: Inspect = (object: any) =>
  isString(object) ? object : util.inspect(object, {
    depth: 2,
    maxArrayLength: 5,
  })

const defaultLogger = {
  [DEBUG]: console.debug,
  [INFO]: console.info,
  [LOG]: console.log,
  [WARN]: console.warn,
  [ERROR]: console.error,
}

export const formatMessage = (messages: Message[]): Message => {
  const [ format, ...args ] = messages
  return messages.length > 1 ? formatter(format, args) : inspect(messages[0])
}

export const transport: TransportFn = (config, messages, verbosity) => {
  const namespace = config.namespace.join(':')
  const message = formatMessage(messages)
  const msg = namespace ? `${namespace} - ${message}` : `${message}`

  const log = defaultLogger[verbosity] || defaultLogger[LOG]
  log(msg)
}

// Global LogConfig
const baseConfiguration: Config = {
  enabled: true,
  namespace: [],
  transport,
  tty: true,
  verbosity: 5,
}

export const configure: ConfigureFn = config => {
  Object.keys(config)
    .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

export const selectProperty = <K extends keyof Config>(property: K) =>
  (base: Config, extra: Partial<Config>) =>
    extra && extra.hasOwnProperty(property) ? extra[property] : base[property]

const selectEnabled = selectProperty('enabled')
const selectTransport = selectProperty('transport')
const selectTTY = selectProperty('tty')
const selectVerbosity = selectProperty('verbosity')

export const mergeNamespace = (base: Config, extra?: Partial<Config>) =>
  [...base.namespace, ...(extra && extra.namespace || [])]

const mergeConfigurations = (base: Config, extra?: Partial<Config>): Config => ({
  enabled: selectEnabled(base, extra),
  namespace: mergeNamespace(base, extra),
  transport: selectTransport(base, extra),
  tty: selectTTY(base, extra),
  verbosity: selectVerbosity(base, extra),
})

const write: WriteFn = (configuration, verbosity: number = LOG) => (...messages) =>
  verbosity <= configuration.verbosity &&
    configuration.transport(configuration, messages, verbosity)

const logFactory: FactoryFn = (configuration: any) => {
  const log: any = write(configuration)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration)
  log.on = logHandlerFactory(log)
  log.error = write(configuration, ERROR)
  log.warn = write(configuration, WARN)
  log.log = write(configuration, LOG)
  log.info = write(configuration, INFO)
  log.debug = write(configuration, DEBUG)
  return log as Log
}

const logFactoryCreator: FactoryCreatorFn = configuration =>
  (...namespace: any[]) => {
    const config = namespace[0] as Partial<Config>
    const configs = mergeConfigurations(configuration, isString(config) ? { namespace } : config)
    return logFactory(configs)
  }

const logHandlerFactory: HandlerFactory = logger =>
  (callback: any, namespace, config): any => {
    const log = logger.create({
      ...config,
      ...namespace && { namespace: [namespace] },
    })
    return (...args: any[]) => {
      log(args)
      return callback(...args)
    }
  }

export const create = logFactory(baseConfiguration).create
