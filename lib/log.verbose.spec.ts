
import * as util from 'util'
import { nxLogger, create, configure } from './log'
import * as faker from 'faker'

import { debugTransport } from '../test-utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10

describe('::verbose', () => {
  let msg: string

  beforeEach(() => msg = faker.random.word())

  const createLog = (extra?: Partial<nxLogger.Config>) => {
    const transport = debugTransport()
    return { transport, log: create({ ...extra, transport }) }
  }

  it('should have verbosity functions', () => {
    const log = create()
    expect(log).toHaveProperty('error')
    expect(log).toHaveProperty('warn')
    expect(log).toHaveProperty('log')
    expect(log).toHaveProperty('info')
    expect(log).toHaveProperty('debug')
  })

  it('should still send out the default log', () => {
    const { log, transport } = createLog()

    log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.messages).toHaveLength(1)
    expect(transport.last.messages[0]).toEqual(msg)
  })

  it('should stop running the default log if the verbosity is set lower', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.WARN })

    log(msg)
    expect(transport.called).toEqual(0)
    expect(transport.last.messages).toHaveLength(0)
  })

  it('should not show log-level messages but error-level message when the verbosity is set to warn-level', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.WARN })

    const logMsg = 'log: ' + faker.random.word()
    const errorMsg = 'error: ' + faker.random.word()

    log.log(logMsg)
    log.error(errorMsg)
    expect(transport.called).toEqual(1)
    expect(transport.last.messages).toHaveLength(1)
    expect(transport.last.messages[0]).toEqual(errorMsg)
  })

  it('should have correct basic settings for error', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.ERROR })

    log.error(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.ERROR)
  })

  it('should have correct basic settings for warn', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.WARN })
    log.warn(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.WARN)
  })

  it('should have correct basic settings for log', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.LOG })
    log.log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.LOG)
  })

  it('should have correct basic settings for default', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.LOG })
    log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.LOG)
  })

  it('should have correct basic settings for info', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.INFO })
    log.info(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.INFO)
  })

  it('should have correct basic settings for debug', () => {
    const { log, transport } = createLog({ verbosity: nxLogger.DEBUG })
    log.debug(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.DEBUG)
  })
})

