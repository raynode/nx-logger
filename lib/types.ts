
// define atomic types
export type Namespace = string[]
export type MessageString = string | number
export type MessageObject = {}
export type Message = MessageString | MessageObject

// basic logger function
export interface LoggerFn {
  (message: any): void
  (message: Message, ...messages: any[]): void
}

// verbosity extension log level definitions
export enum LogLevel {
  DEBUG = 10,
  INFO = 7,
  LOG = 5,
  WARN = 3,
  ERROR = 1,
}

// define transport
export type TransportHandler<T> = (configuration: Config, messages: Message[], verbosity: number) => T
export type TransportFn = TransportHandler<void>

// define config type
export interface Config {
  readonly enabled: boolean
  readonly namespace: Namespace
  readonly transport: TransportFn
  readonly tty: boolean
  readonly verbosity: number
}

export interface ChildConfiguration {
  enabled?: boolean // | (() => boolean)
  namespace?: Namespace // | (() => Namespace)
  transport?: TransportFn // | (() => TransportFn)
  tty?: boolean // | (() => boolean)
  verbosity?: number // | (() => number)
}

//
export type ConfigureFn = (options?: Partial<Config>) => Config

// define handler
export type Handler = <T>(callback: T, namespace?: string, config?: Partial<Config>) => T
export type HandlerFactory = (log: Log) => Handler

// define log function
export interface Log extends LoggerFn {
  readonly configuration: () => Config
  create: SimpleFactoryFn
  on: Handler
  error: LoggerFn
  warn: LoggerFn
  log: LoggerFn
  info: LoggerFn
  debug: LoggerFn
  update: (config: Partial<Config>) => Config
}

// simplified factory function which will be used by most people in code
export interface SimpleFactoryFn {
  (configuration: Partial<Config>): Log
  (...namespace: Namespace): Log
}

// define Factory function types
export type FactoryFn = (configuration: Config) => Log
export type FactoryCreatorFn = (parent: Log) => SimpleFactoryFn
export type WriteFn = (log: Log, verbosity?: number) => LoggerFn
