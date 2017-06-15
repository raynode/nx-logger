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

  // define log function
  export interface Log {
    (message: Message): Result
    readonly configuration: Config
    create?: FactoryFn
  }
  export type FactoryFn = (configuration: ConfigPartial) => Log
  export type FactoryCreatorFn = (configuration: Config) => FactoryFn
  export type SimplyFactoryFn = (configuration: Config | Namespace) => Log
  export type WriteFn = (configuration: Config) => (...messages: Message[]) => Result
  export type ConfigureFn = (options?: ConfigPartial) => Config

}

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
