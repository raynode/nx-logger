
import { TransportFn, TransportHandler } from './types'

export const split = (
  condition: TransportHandler<boolean>,
  onTrue: TransportFn | null,
  onFalse?: TransportFn,
): TransportFn => (configuration, messages, verbosity) =>
    condition(configuration, messages, verbosity)
      ? onTrue && onTrue(configuration, messages, verbosity)
      : onFalse && onFalse(configuration, messages, verbosity)
