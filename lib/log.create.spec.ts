
// tslint:disable-next-line
import * as faker from 'faker'
import * as util from 'util'

import { configure, create, transport as defaultTransport } from './log.initial'
import { defaultLoggers } from './log'
import { LogLevel } from './types'
import { capture, CaptureFn, debugTransport } from '../test-utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50

const expectOnLog = (onLog: CaptureFn, msg: string) =>
  onLog((str: string) => expect(str).toEqual(msg))

describe('::create', () => {
  it('should log a simple string', () => {
    const transport = debugTransport()
    configure({ transport })
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const log = create(fakes.logger)
    log(fakes.message)
    expect(transport.called).toBeTruthy()
    expect(transport.last.messages[0]).toEqual(fakes.message)
  })

  it('should accept mutilple arguments and use them as namespace', () => {
    const transport = debugTransport()
    const namespace = [faker.random.word(), faker.random.word()]
    configure({ transport })
    const log = create(...namespace)
    const msg = faker.random.words()
    log(msg)
    expect(transport.called).toBeTruthy()
    expect(transport.last.messages[0]).toEqual(msg)
    expect(transport.last.config.namespace).toEqual(namespace)
  })

  it('should log multiple strings', () => {
    const transport = debugTransport()
    configure({ transport })
    const fakes = {
      logger: faker.lorem.word(),
      messages: [1, 2, 3, 4].map(faker.lorem.word),
    }
    const log = create(fakes.logger)
    const [format, ...messages] = fakes.messages
    log(format, ...messages)
    expect(transport.called).toBeTruthy()
    expect(transport.last.messages).toEqual(fakes.messages)
  })

  it('should log objects', () => {
    const transport = debugTransport()
    configure({ transport })
    const fakes = {
      logger: faker.lorem.word(),
      obj: {
        test: faker.lorem.word(),
      },
    }
    const log = create(fakes.logger)
    log(fakes.obj)
    expect(transport.called).toBeTruthy()
    expect(transport.last.messages[0]).toEqual(fakes.obj)
  })

  it('should create a new logger without any parameters', () => {
    const transport = debugTransport()
    configure({ transport })
    const fakes = {
      logger: faker.lorem.word(),
      message: faker.lorem.word(),
    }
    const logSource = create(fakes.logger)
    const log = logSource.create()
    log(fakes.message)
    expect(transport.called).toBeTruthy()
    expect(transport.last.config.namespace).toEqual([fakes.logger])
    expect(transport.last.messages).toEqual([fakes.message])
  })

  it('should send the message without a namespace when non is given', () => {
    const transport = debugTransport()
    configure({ transport })
    const log = create()
    const msg = faker.random.word()
    log(msg)
    expect(transport.called).toBeTruthy()
    expect(transport.last.config.namespace).toEqual([])
    expect(transport.last.messages[0]).toEqual(msg)
  })
})

describe('default transport', () => {
  it('should write to :log when the verbosity has no special console function', () => {
    let data = null
    defaultLoggers[LogLevel.LOG] = (...args: any[]) => data = args
    const msg = faker.random.word()
    const obj = { msg: faker.random.word() }
    const namespace = [faker.random.word()]
    const config = create().configuration()
    defaultTransport(config, [msg], LogLevel.LOG)
    expect(data).not.toBeNull()
    expect(data).toEqual([msg])
    defaultTransport({
      ...config,
      namespace,
    }, [obj], -1)
    const objStr = util.inspect(obj, {
      depth: 2,
      maxArrayLength: 5,
    })
    expect(data).toEqual([[namespace.join(':'), objStr].join(' - ')])
  })
})
