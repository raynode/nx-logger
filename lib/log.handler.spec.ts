
// tslint:disable-next-line
import * as faker from 'faker'

import * as util from 'util'
import { create } from './log'

import { debugTransport } from '../test-utils'

describe('::create', () => {
  it('should automatically log when a handled function is called', () => {
    const transport = debugTransport()
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create({ namespace: [fakes.logger], transport })
    let called = 0
    let last: number = 0
    const fn = (n: number) => {
      called++
      last = n
    }

    expect(called).toBe(0)
    fn(1)
    expect(called).toBe(1)
    expect(last).toBe(1)

    const fn2 = log.on(fn, fakes.message)

    fn2(3)
    expect(last).toBe(3)
    expect(called).toBe(2)
    expect(transport.called).toEqual(1)
    expect(transport.last.config.namespace).toEqual([fakes.logger, fakes.message])
    expect(transport.last.messages).toHaveLength(1)
    expect(transport.last.messages[0]).toEqual([3])
  })

  it('should handle handlers without extra namespacing', () => {
    const transport = debugTransport()
    const namespace = [faker.lorem.word()]
    const call = faker.random.word()
    const log = create({ namespace, transport })
    let test: string = ''
    const fn = log.on((n: string) => test = n)
    expect(test).toEqual('')

    fn(call)
    expect(test).toEqual(call)
    expect(transport.last.messages).toHaveLength(1)
    expect(transport.last.config.namespace).toEqual(namespace)
  })
})
