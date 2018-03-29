
import {
  formatMessage,
  formatter,
  inspect,
  isString,
  selectProperty,
} from './utils'

import {
  Config,
  HandlerFactory,
  Log,
  LoggerFn,
  LogLevel,
  Namespace,
  SimpleFactoryFn,
  TransportFn,
} from './types'

export type FactoryFn = (configuration: Partial<Config>) => Log
export type FactoryCreatorFn = (configuration: Config) => SimpleFactoryFn
export type WriteFn = (configuration: Config, verbosity?: number) => LoggerFn

export const defaultLoggers = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.LOG]: console.log,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
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

const write: WriteFn = (configuration, verbosity: number = LogLevel.LOG) => (...messages) =>
  verbosity <= configuration.verbosity &&
    configuration.transport(configuration, messages, verbosity)

export const logFactory: FactoryFn = (configuration: any) => {
  const log: any = write(configuration)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration)
  log.on = logHandlerFactory(log)
  log.error = write(configuration, LogLevel.ERROR)
  log.warn = write(configuration, LogLevel.WARN)
  log.log = write(configuration, LogLevel.LOG)
  log.info = write(configuration, LogLevel.INFO)
  log.debug = write(configuration, LogLevel.DEBUG)
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
