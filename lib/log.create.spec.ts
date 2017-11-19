
import * as util from 'util'
import { create, configure } from './log'
import * as faker from 'faker'

import { capture } from '../test-utils'

describe('::create', () => {
  it('should log a simple string', done => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    capture( onLog => {
      onLog((str: string) =>
        expect(str).toEqual([fakes.logger, ' - ', fakes.message].join(''))
      )
      log(fakes.message)
      expect(onLog.called).not.toBe(0)
      expect(onLog.called).toBe(1)
      done()
    })
  })

  it('should log multiple strings', done => {
    const fakes = {
      logger: faker.lorem.word(),
      messages: [1, 2, 3, 4].map(faker.lorem.word),
    }
    const log = create(fakes.logger)
    capture( onLog => {
      const message = fakes.messages.join(' ')
      onLog((str: string) =>
        expect(str).toEqual([fakes.logger, ' - ', message].join(''))
      )
      const [format, ...messages] = fakes.messages
      log(format, ...messages)
      expect(onLog.called).toBe(1)
      done()
    })
  })

  it('should log objects', done => {
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
        expect(str).toEqual([fakes.logger, ' - ', message].join(''))
      )
      log(fakes.obj)
      expect(onLog.called).toBe(1)
      done()
    })
  })

  it('should format strings', done => {
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
        expect(str).toEqual([fakes.logger, ' - ', message].join(''))
      )
      log(fakes.formatter, ...fakes.parts)
      expect(onLog.called).toBe(1)
      done()
    })
  })

  it('should create a new logger without any parameters', done => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log_source = create(fakes.logger)
    const log = log_source.create()
    capture( onLog => {
      onLog((str: string) =>
        expect(str).toEqual([fakes.logger, ' - ', fakes.message].join(''))
      )
      log(fakes.message)
      expect(onLog.called).not.toBe(0)
      expect(onLog.called).toBe(1)
      done()
    })
  })
})
