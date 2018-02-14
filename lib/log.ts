
import * as util from 'util'

export const isString = (obj: any): obj is string => typeof obj === 'string'

export namespace nxLogger {

  export const DEBUG = 10
  export const INFO = 7
  export const LOG = 5
  export const WARN = 3
  export const ERROR = 1

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
}

const formatter: nxLogger.Formatter = (format, args) => util.format(format, ...args)
const inspect: nxLogger.Inspect = (object: any) =>
  isString(object) ? object : util.inspect(object, {
    depth: 2,
    maxArrayLength: 5,
  })

const defaultLogger = {
  [nxLogger.DEBUG]: console.debug,
  [nxLogger.INFO]: console.info,
  [nxLogger.LOG]: console.log,
  [nxLogger.WARN]: console.warn,
  [nxLogger.ERROR]: console.error,
}

export const formatMessage = (messages: nxLogger.Message[]): nxLogger.Message => {
  const [ format, ...args ] = messages
  return messages.length > 1 ? formatter(format, args) : inspect(messages[0])
}

const transport: nxLogger.TransportFn = (config, messages, verbosity) => {
  const namespace = config.namespace.join(':')
  const message = formatMessage(messages)
  const msg = namespace ? `${namespace} - ${message}` : `${message}`

  const log = defaultLogger[verbosity] || defaultLogger[nxLogger.LOG]
  log(msg)
}

// Global LogConfig
const baseConfiguration: nxLogger.Config = {
  enabled: true,
  namespace: [],
  transport,
  tty: true,
  verbosity: 5,
}

export const configure: nxLogger.ConfigureFn = config => {
  Object.keys(config)
    .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

const mergeConfigurations = (base: nxLogger.Config, extra?: Partial<nxLogger.Config>): nxLogger.Config => {
  const enabled = extra && extra.hasOwnProperty('enabled') ? extra.enabled : base.enabled
  const namespace = [...base.namespace, ...(extra && extra.namespace || [])]
  const transport = extra && extra.transport || base.transport
  const tty = extra && extra.hasOwnProperty('tty') ? extra.tty : base.tty
  const verbosity = extra && extra.hasOwnProperty('verbosity') ? extra.verbosity : base.verbosity
  return {
    enabled,
    namespace,
    transport,
    tty,
    verbosity,
  }
}

const write: nxLogger.WriteFn = (configuration, verbosity: number = nxLogger.LOG) => (...messages) =>
  verbosity <= configuration.verbosity &&
    configuration.transport(configuration, messages, verbosity)

const logFactory: nxLogger.FactoryFn = (configuration: any) => {
  const log: any = write(configuration)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration)
  log.on = logHandlerFactory(log)
  log.error = write(configuration, nxLogger.ERROR)
  log.warn = write(configuration, nxLogger.WARN)
  log.log = write(configuration, nxLogger.LOG)
  log.info = write(configuration, nxLogger.INFO)
  log.debug = write(configuration, nxLogger.DEBUG)
  return log as nxLogger.Log
}

const logFactoryCreator: nxLogger.FactoryCreatorFn = configuration =>
  (...namespace: any[]) => {
    const config = namespace[0] as Partial<nxLogger.Config>
    const configs = mergeConfigurations(configuration, isString(config) ? { namespace } : config)
    return logFactory(configs)
  }

const logHandlerFactory: nxLogger.HandlerFactory = logger =>
  (callback: any, namespace, config): any => {
    const log = logger.create({
      ...config,
      ...namespace && { namespace: [namespace] }
    })
    return (...args: any[]) => {
      log(args)
      return callback(...args)
    }
  }

export const create = logFactory(baseConfiguration).create
