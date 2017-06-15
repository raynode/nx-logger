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

declare const configure: nxLogger.ConfigureFn
declare const create: nxLogger.FactoryFn
