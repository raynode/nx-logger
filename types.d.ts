
// define atomic types
export type LogResult = void
export type LogNamespace = string[]
export type LogMessageString = string
export type LogMessageObject = string
export type LogMessage = LogMessageString | LogMessageObject

// define config type
export interface LogConfigPartial {
  enabled?: boolean
  namespace?: LogNamespace
  transport?: LogTransportFn
  tty?: boolean
}

export interface LogConfig extends LogConfigPartial {
  enabled: boolean
  namespace: LogNamespace
  transport: LogTransportFn
  tty: boolean
}

// define transport
export type LogTransportFn = (configuration: LogConfig, messages: LogMessage[]) => LogResult

// define log function
export interface LogFn {
  (message: LogMessage): LogResult
  readonly configuration: LogConfig
  create?: LogFactoryFn
}
export type LogFactoryFn = (configuration: LogConfigPartial) => LogFn
export type LogFactoryCreatorFn = (configuration: LogConfig) => LogFactoryFn
export type LogSimplyFactoryFn = (configuration: LogConfig | LogNamespace) => LogFn
export type LogWriteFn = (configuration: LogConfig) => (message: LogMessage) => LogResult
export type LogConfigureFn = (options?: LogConfigPartial) => LogConfig
