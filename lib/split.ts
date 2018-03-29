
import { TransportFn, TransportHandler } from './types'

export const split = (
  condition: TransportHandler<boolean>,
  onTrue: TransportFn | null,
  onFalse?: TransportFn,
): TransportFn =>
  (configuration, messages, verbosity) => {
    const res = condition(configuration, messages, verbosity)
    if(condition(configuration, messages, verbosity))
      return onTrue ? onTrue(configuration, messages, verbosity) : null
    return onFalse ? onFalse(configuration, messages, verbosity) : null
  }
