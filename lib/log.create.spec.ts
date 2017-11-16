
import * as util from 'util'
import { create, configure } from './log'
import * as faker from 'faker'
import * as expect from 'unexpected'
import 'mocha'

import { capture } from '../test-utils'

describe('::create', () => {
  it('should log a simple string', () => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    capture( onLog => {
      onLog((str: string) =>
        expect(str, 'to equal', [fakes.logger, ' - ', fakes.message].join(''))
      )
      log(fakes.message)
      expect(onLog.called, 'not to be', 0)
      expect(onLog.called, 'to be', 1)
    })
  })

  it('should log multiple strings', () => {
    const fakes = {
      logger: faker.lorem.word(),
      messages: [1, 2, 3, 4].map(faker.lorem.word),
    }
    const log = create(fakes.logger)
    capture( onLog => {
      const message = fakes.messages.join(' ')
      onLog((str: string) =>
        expect(str, 'to equal', [fakes.logger, ' - ', message].join(''))
      )
      const [format, ...messages] = fakes.messages
      log(format, ...messages)
      expect(onLog.called, 'to be', 1)
    })
  })

  it('should log objects', () => {
    const fakes = {
      logger: faker.lorem.word(),
      obj: {
        test: faker.lorem.word()
      }
    }
    const log = create(fakes.logger)
    capture(onLog => {
      const message = util.inspect(fakes.obj)
      onLog((str: string) =>
        expect(str, 'to equal', [fakes.logger, ' - ', message].join(''))
      )
      log(fakes.obj)
      expect(onLog.called, 'to be', 1)
    })
  })

  it('should format strings', () => {
    const fakes = {
      logger: faker.lorem.word(),
      formatter: "message(%d, %s, %d)",
      parts: [1, 'test', 2]
    }
    const obj = {
      logger: faker.lorem.word(),
      test: faker.lorem.word()
    }
    const log = create(fakes.logger)
    capture(onLog => {
      const message = `message(${fakes.parts[0]}, ${fakes.parts[1]}, ${fakes.parts[2]})`
      onLog((str: string) =>
        expect(str, 'to equal', [fakes.logger, ' - ', message].join(''))
      )
      log(fakes.formatter, ...fakes.parts)
      expect(onLog.called, 'to be', 1)
    })
  })
})

