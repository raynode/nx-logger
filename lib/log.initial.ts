
import {
  defaultLoggers,
  logFactory,
} from './log'

import {
  formatMessage,
} from './utils'

import {
  Config,
  ConfigureFn,
  LogLevel,
  SimpleFactoryFn,
  TransportFn,
} from './types'

export const transport: TransportFn = (config, messages, verbosity) => {
  const namespace = config.namespace.join(':')
  const message = formatMessage(messages)
  const msg = namespace ? `${namespace} - ${message}` : `${message}`

  const log = defaultLoggers[verbosity] || defaultLoggers[LogLevel.LOG]
  log(msg)
}

// Global LogConfig
const baseConfiguration: Config = {
  enabled: true,
  namespace: [],
  transport,
  tty: true,
  verbosity: LogLevel.LOG,
}

export const configure: ConfigureFn = config => {
  if(config)
    Object.keys(config)
      .forEach(property => baseConfiguration[property] = config[property])
  return baseConfiguration
}

export const getBaseConfiguration = () => baseConfiguration
export const create: SimpleFactoryFn = (...configuration) => logFactory({}).create(...configuration)
