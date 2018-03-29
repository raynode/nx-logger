
import {
  formatMessage,
  formatter,
  inspect,
  isString,
  selectProperty,
} from './utils'

import {
  Config,
  LoggerFn,
  TransportFn,
} from './types'

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

export const defaultLoggers = {
  [DEBUG]: console.debug,
  [INFO]: console.info,
  [LOG]: console.log,
  [WARN]: console.warn,
  [ERROR]: console.error,
}

export const transport: TransportFn = (config, messages, verbosity) => {
  const namespace = config.namespace.join(':')
  const message = formatMessage(messages)
  const msg = namespace ? `${namespace} - ${message}` : `${message}`

  const log = defaultLoggers[verbosity] || defaultLoggers[LOG]
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
