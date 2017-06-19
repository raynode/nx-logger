
import * as util from 'util'
import { create, configure } from '../lib/log'
import * as faker from 'faker'
import * as expect from 'unexpected'
import 'mocha'

import { capture } from './utils'

describe('::create', () => {
  it('should automatically log when a handled function is called', () => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    let called = 0
    const fn = () => called++

    expect(called, 'to be', 0)
    fn()
    expect(called, 'to be', 1)

    const fn2 = log.on(fakes.message, fn)

    capture(onLog => {
      onLog((str: string) =>
        expect(str, 'to equal', [fakes.logger, ' - ', fakes.message, ' []'].join(''))
      )
      fn2()
      expect(called, 'to be', 2)
      expect(onLog.called, 'not to be', 0)
      expect(onLog.called, 'to be', 1)
    })
  })
})

