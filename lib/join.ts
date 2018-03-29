
import { Config, Message, TransportFn } from './types'

export const join = (...transports: TransportFn[]): TransportFn =>
  (configuration, messages, verbosity) =>
    transports.forEach(transport => transport(configuration, messages, verbosity))
