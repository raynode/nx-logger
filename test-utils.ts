
import { nxLogger } from './lib/log'
import * as sinon from 'sinon'

export interface CaptureFn {
  (message: any): void
  called: number
}

export interface DebugFn {
  last: {
    config: nxLogger.Config,
    messages: nxLogger.Message[]
    verbosity: number
  }
  called: number
}

export const debugTransport = (): nxLogger.TransportFn & DebugFn => {
  const transport: any  = (config: nxLogger.Config, messages: nxLogger.Message[], verbosity) => {
    transport.last = { config, messages, verbosity }
    transport.called++
  }
  transport.last = { config: null, messages: [] }
  transport.called = 0
  transport.verbosity = -1
  return transport
}

export const capture = (callback: (onLog: CaptureFn) => void) => {
  const log = sinon.stub(console, 'log')
  let err
  const setFake: any = fn => {
    setFake.called++
    log.callsFake(fn)
  }
  setFake.called = 0

  try {
    callback(setFake)
  } catch (e) {
    err = e
  }
  log.restore()
  if (err)
    throw err
}
