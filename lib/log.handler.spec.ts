
import * as util from 'util'
import { create, configure } from './log'
import * as faker from 'faker'

import { capture } from '../test-utils'

describe('::create', () => {
  it('should automatically log when a handled function is called', done => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    let called = 0
    const fn = () => called++

    expect(called).toBe(0)
    fn()
    expect(called).toBe(1)

    const fn2 = log.on(fakes.message, fn)

    capture(onLog => {
      onLog((str: string) =>
        expect(str).toEqual([fakes.logger, ' - ', fakes.message, ' []'].join(''))
      )
      fn2()
      expect(called).toBe(2)
      expect(onLog.called).not.toBe(0)
      expect(onLog.called).toBe(1)
      done()
    })
  })
})

