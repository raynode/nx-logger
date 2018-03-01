
import * as util from 'util'
import { create, configure } from './log'
import * as faker from 'faker'

import { capture, CaptureFn } from '../test-utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50

const expectOnLog = (onLog: CaptureFn, msg: string) =>
  onLog((str: string) =>
    expect(str).toEqual(msg)
  )

describe('::create', () => {
  it('should log a simple string', done => {
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    capture( onLog => {
      expectOnLog(onLog, [fakes.logger, ' - ', fakes.message].join(''))
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
      expectOnLog(onLog, [fakes.logger, ' - ', message].join(''))
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
      expectOnLog(onLog, [fakes.logger, ' - ', message].join(''))
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
      expectOnLog(onLog, [fakes.logger, ' - ', message].join(''))
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
      expectOnLog(onLog, [fakes.logger, ' - ', fakes.message].join(''))
      log(fakes.message)
      expect(onLog.called).not.toBe(0)
      expect(onLog.called).toBe(1)
      done()
    })
  })

  it('should send the message without a namespace when non is given', done => {
    const log = create()
    const msg = faker.random.word()
    capture( onLog => {
      onLog(str => {
        expect(str).toEqual(msg)
      })
      log(msg)
      expect(onLog.called).toBe(1)
      done()
    })
  })
})

describe('default transport', () => {
  it('should write to :log when the verbosity has no special console function', done => {
    const transport = create().configuration.transport
    const msg = faker.random.word()
    capture( onLog => {
      onLog(str => {
        expect(str).toEqual(msg)
      })
      transport(create().configuration, [msg], 2) // 2 is between 1: Error and 3: Warning
      expect(onLog.called).toBe(1)
      done()
    })
  })
})
