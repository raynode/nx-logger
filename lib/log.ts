
import {
  formatMessage,
  formatter,
  inspect,
  isString,
  mergeNamespace,
  selectProperty,
} from './utils'

import {
  ChildConfiguration,
  Config,
  FactoryCreatorFn,
  FactoryFn,
  HandlerFactory,
  Log,
  LoggerFn,
  LogLevel,
  Namespace,
  SimpleFactoryFn,
  TransportFn,
  WriteFn,
} from './types'

import {
  getBaseConfiguration,
} from './log.initial'

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

const mergeConfigurations = (base: Config, extra: ChildConfiguration): Config => ({
  enabled: selectEnabled(base, extra),
  namespace: mergeNamespace(base, extra),
  transport: (extra && extra.transport) || base.transport,
  tty: selectTTY(base, extra),
  verbosity: selectVerbosity(base, extra),
})

const resolveConfiguration = (parent: Log, configuration: Config | ChildConfiguration): Config => {
  const parentConfiguration = parent ? parent.configuration() : getBaseConfiguration()
  return !configuration
    ? parentConfiguration
    : mergeConfigurations(parentConfiguration, configuration)
}

const write: WriteFn = (log, verbosity) => (...messages) => {
  const configuration = log.configuration()
  return verbosity <= configuration.verbosity &&
    configuration.transport(configuration, messages, verbosity)
}

export const logFactory = (configuration: Config | ChildConfiguration, parent = null) => {
  let localConfiguration = configuration
  const log: any = (...args) => log.log(...args)
  log.configuration = () => resolveConfiguration(parent, localConfiguration)
  log.create = logFactoryCreator(log)
  log.on = logHandlerFactory(log)
  log.error = write(log, LogLevel.ERROR)
  log.warn = write(log, LogLevel.WARN)
  log.log = write(log, LogLevel.LOG)
  log.info = write(log, LogLevel.INFO)
  log.debug = write(log, LogLevel.DEBUG)
  log.update = (config: Partial<Config>) => localConfiguration = config
  return log as Log
}

const logFactoryCreator: FactoryCreatorFn = parent =>
  (...namespace) => {
    const config = namespace[0] as Partial<Config>
    const childConfiguration = isString(config) ? { namespace } : config
    return logFactory(childConfiguration, parent)
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
