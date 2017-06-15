
import {
  LogConfig,
  LogConfigPartial,
  LogConfigureFn,
  LogFactoryCreatorFn,
  LogFactoryFn,
  LogFn,
  LogMessage,
  LogMessageObject,
  LogMessageString,
  LogNamespace,
  LogResult,
  LogSimplyFactoryFn,
  LogTransportFn,
  LogWriteFn,
} from '../types'

// Global LogConfig
const baseConfiguration = {
  enabled: true,
  namespace: [],
  transport: () => null,
  tty: true,
}

export const setConfiguration: LogConfigureFn = config => {
  Object.keys(config)
    .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

const mergeConfigurations = (base: LogConfig, extra: LogConfigPartial): LogConfig => {
  const enabled = extra.hasOwnProperty('enabled') ? extra.enabled : base.enabled
  const namespace = [...base.namespace, ...(extra.namespace || [])]
  const transport = extra.transport || base.transport
  const tty = extra.hasOwnProperty('tty') ? extra.tty : base.tty
  return {
    enabled,
    namespace,
    transport,
    tty,
  }
}

const write: LogWriteFn = configuration => (...messages) => {
  return configuration.transport(configuration, messages)
}

const logFactory: LogFactoryFn = configuration => {
  const log: any = write(configuration as LogConfig)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration as LogConfig)
  return log as LogFn
}

const logFactoryCreator: LogFactoryCreatorFn = configuration =>
  config => {
    const configs = mergeConfigurations(configuration, typeof config === 'string' ? {
      namespace: [config],
    } : config)
    return logFactory(configs)
  }

export const create = logFactory(baseConfiguration).create
