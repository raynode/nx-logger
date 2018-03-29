
// define atomic types
export type Namespace = string[]
export type MessageString = string
export type MessageObject = string
export type Message = MessageString | MessageObject
export interface LoggerFn {
  (message: any): void
  (message: Message, ...messages: any[]): void
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
