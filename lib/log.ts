
import * as util from 'util'

export namespace nxLogger {

  // define atomic types
  export type Result = void
  export type Namespace = string[]
  export type MessageString = string
  export type MessageObject = string
  export type Message = MessageString | MessageObject

  // define config type
  export interface ConfigPartial {
    enabled?: boolean
    namespace?: Namespace
    transport?: TransportFn
    tty?: boolean
  }

  export interface Config extends ConfigPartial {
    enabled: boolean
    namespace: Namespace
    transport: TransportFn
    tty: boolean
  }

  // define transport
  export type TransportFn = (configuration: Config, messages: Message[]) => Result
  export type Formatter = (format: string, args: any[]) => string
  export type Inspect = (object: any, options?: any) => string

  // define handler
  export type Handler = (message: Message, callback: Function) => Function
  export type HandlerFactory = (log: Log) => Handler

  // define log function
  export interface Log {
    (message: any): Result
    (message: Message, ...messages: any[]): Result
    readonly configuration: Config
    create: SimplyFactoryFn
    on: Handler
  }
  export type FactoryFn = (configuration: ConfigPartial) => Log
  export type FactoryCreatorFn = (configuration: Config) => SimplyFactoryFn
  export interface SimplyFactoryFn {
    (configuration: Config): Log
    (...namespace: Namespace): Log
  }
  export type WriteFn = (configuration: Config) => (...messages: Message[]) => Result
  export type ConfigureFn = (options?: ConfigPartial) => Config
}

const formatter: nxLogger.Formatter = (format, args) => util.format(format, ...args)
const inspect: nxLogger.Inspect = (object: any, options = {}) => typeof object === 'string' ?
  object : util.inspect(object, options)

const transport: nxLogger.TransportFn = (config, messages) => {
  const namespace = config.namespace.join(':')
  const [ format, ...args ] = messages
  const message = messages.length > 1 ? formatter(format, args) : inspect(messages[0])

  console.log(`${namespace} - ${message}`)
}

// Global LogConfig
const baseConfiguration: nxLogger.Config = {
  enabled: true,
  namespace: [],
  transport,
  tty: true,
}

export const configure: nxLogger.ConfigureFn = config => {
  Object.keys(config)
    .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

const mergeConfigurations = (base: nxLogger.Config, extra?: nxLogger.ConfigPartial): nxLogger.Config => {
  const enabled = extra && extra.hasOwnProperty('enabled') ? extra.enabled : base.enabled
  const namespace = [...base.namespace, ...(extra && extra.namespace || [])]
  const transport = extra && extra.transport || base.transport
  const tty = extra && extra.hasOwnProperty('tty') ? extra.tty : base.tty
  return {
    enabled,
    namespace,
    transport,
    tty,
  }
}

const write: nxLogger.WriteFn = configuration => (...messages) => {
  return configuration.transport(configuration, messages)
}

const logFactory: nxLogger.FactoryFn = configuration => {
  const log: any = write(configuration as nxLogger.Config)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration as nxLogger.Config)
  log.on = logHandlerFactory(log)
  return log as nxLogger.Log
}

const logFactoryCreator: nxLogger.FactoryCreatorFn = configuration =>
  (...namespace: any[]) => {
    const config = namespace[0] as nxLogger.ConfigPartial
    const configs = mergeConfigurations(configuration, typeof config === 'string' ? { namespace } : config)
    return logFactory(configs)
  }

const logHandlerFactory: nxLogger.HandlerFactory = log =>
  (message: nxLogger.Message, callback: Function) =>
    (...args: any[]) => {
      log(message, args)
      return callback(...args)
    }

export const create = logFactory(baseConfiguration).create
