
// tslint:disable-next-line
import * as faker from 'faker'

import { configure } from './log.initial'
import { split } from './split'

describe('transport conditional splitting', () => {
  it('should work randomly', () => {
    const configuration = configure()
    const calls = []
    const t1 = (...args) => calls.push({ name: 't1', args })
    const t2 = (...args) => calls.push({ name: 't2', args })
    const res = faker.random.boolean()
    const msg = faker.random.words().split(' ')
    const condition = (config, messages, verbosity) => {
      expect(config).toBe(configuration)
      expect(messages).toBe(msg)
      expect(verbosity).toBe(5)
      return res
    }
    const transport = split(condition, t1, t2)
    transport(configuration, msg, 5)
    expect(calls).toHaveLength(1)
    expect(calls[0].name).toBe(res ? 't1' : 't2')
  })

  it('should be calling the first one when true', () => {
    let called = false
    split(() => true, () => called = true)(null, null, null)
    expect(called).toBeTruthy()
  })

  it('should be calling the second one when false', () => {
    let called = false
    split(() => false, null, () => called = true)(null, null, null)
    expect(called).toBeTruthy()
  })

  it('should not throw when the first is null and the condition is true', () => {
    expect(() => {
      split(() => true, null)(null, null, null)
    }).not.toThrow()
  })

  it('should not throw when the second is null and the condition is false', () => {
    expect(() => {
      split(() => false, null)(null, null, null)
    }).not.toThrow()
  })
})
