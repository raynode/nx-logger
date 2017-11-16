
import * as sinon from 'sinon'

interface CaptureFn {
  (message: any): void
  called: number
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
