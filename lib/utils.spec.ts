
// tslint:disable-next-line
import * as faker from 'faker'
import * as utils from './utils'

describe('::utils', () => {
  describe('::formatMessage', () => {
    it('it should format a string correctly', () => {
      const fakes = {
        formatter: 'message(%d, %s, %d)',
        logger: faker.lorem.word(),
        parts: [1, 'test', 2],
      }
      const message = utils.formatMessage([fakes.formatter, ...fakes.parts])
      expect(message).toBe(`message(${fakes.parts[0]}, ${fakes.parts[1]}, ${fakes.parts[2]})`)
    })
  })
})
