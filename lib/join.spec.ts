
// tslint:disable-next-line
import * as faker from 'faker'

import { join } from './join'
import { configure } from './log.initial'

describe('transport joining', () => {
  it('should call each transport with the given parameters', () => {
    const configuration = configure()
    const calls: Array<{ name: string, args: any[] }> = []
    const t1 = (...args: any[]) => calls.push({ name: 't1', args })
    const t2 = (...args: any[]) => calls.push({ name: 't2', args })
    const transport = join(t1, t2)
    const msg = faker.random.words().split(' ')
    transport(configuration, msg, 5)
    expect(calls).toHaveLength(2)
    expect(calls[0].name).toBe('t1')
    expect(calls[1].name).toBe('t2')
    expect(calls[0].args).toEqual(calls[1].args)
  })
})
