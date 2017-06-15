
import {
  nxLogger
} from '../types'

// Global LogConfig
const baseConfiguration: nxLogger.Config = {
  enabled: true,
  namespace: [],
  transport: () => null,
  tty: true,
}

export const configure: nxLogger.ConfigureFn = config => {
  Object.keys(config)
    .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

const mergeConfigurations = (base: nxLogger.Config, extra: nxLogger.ConfigPartial): nxLogger.Config => {
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

const write: nxLogger.WriteFn = configuration => (...messages) => {
  return configuration.transport(configuration, messages)
}

const logFactory: nxLogger.FactoryFn = configuration => {
  const log: any = write(configuration as nxLogger.Config)
  log.configuration = configuration
  log.create = logFactoryCreator(configuration as nxLogger.Config)
  return log as nxLogger.Log
}

const logFactoryCreator: nxLogger.FactoryCreatorFn = configuration =>
  config => {
    const configs = mergeConfigurations(configuration, typeof config === 'string' ? {
      namespace: [config],
    } : config)
    return logFactory(configs)
  }

export const create = logFactory(baseConfiguration).create
