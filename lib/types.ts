
// define atomic types
export type Namespace = string[]
export type MessageString = string
export type MessageObject = string
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
export type TransportFn = (configuration: Config, messages: Message[], verbosity: number) => void

// define config type
export interface Config {
  enabled: boolean
  namespace: Namespace
  transport: TransportFn
  tty: boolean
  verbosity: number
}

//
export type ConfigureFn = (options?: Partial<Config>) => Config

// define handler
export type Handler = <T>(callback: T, namespace?: string, config?: Partial<Config>) => T
export type HandlerFactory = (log: Log) => Handler

// define log function
export interface Log extends LoggerFn {
  readonly configuration: Config
  create: SimpleFactoryFn
  on: Handler
  error: LoggerFn
  warn: LoggerFn
  log: LoggerFn
  info: LoggerFn
  debug: LoggerFn
}

export interface SimpleFactoryFn {
  (configuration: Partial<Config>): Log
  (...namespace: Namespace): Log
}
