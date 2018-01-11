
import * as util from 'util'
import { nxLogger, create, configure } from './log'
import * as faker from 'faker'

import { debugTransport } from '../test-utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10

describe('::verbose', () => {
  it('should have verbosity functions', () => {
    const log = create()
    expect(log).toHaveProperty('error')
    expect(log).toHaveProperty('warn')
    expect(log).toHaveProperty('log')
    expect(log).toHaveProperty('info')
    expect(log).toHaveProperty('debug')
  })

  it('should still send out the default log', () => {
    const transport = debugTransport()
    const log = create({ transport })

    const msg = faker.random.word()

    log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.messages).toHaveLength(1)
    expect(transport.last.messages[0]).toEqual(msg)
  })

  it('should stop running the default log if the verbosity is set lower', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.WARN })

    const msg = faker.random.word()

    log(msg)
    expect(transport.called).toEqual(0)
    expect(transport.last.messages).toHaveLength(0)
  })

  it('should have correct basic settings for error', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.ERROR })
    const msg = faker.random.word()
    log.error(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.ERROR)
  })

  it('should have correct basic settings for warn', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.WARN })
    const msg = faker.random.word()
    log.warn(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.WARN)
  })

  it('should have correct basic settings for log', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.LOG })
    const msg = faker.random.word()
    log.log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.LOG)
  })

  it('should have correct basic settings for default', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.LOG })
    const msg = faker.random.word()
    log(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.LOG)
  })

  it('should have correct basic settings for info', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.INFO })
    const msg = faker.random.word()
    log.info(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.INFO)
  })

  it('should have correct basic settings for debug', () => {
    const transport = debugTransport()
    const log = create({ transport, verbosity: nxLogger.DEBUG })
    const msg = faker.random.word()
    log.debug(msg)
    expect(transport.called).toEqual(1)
    expect(transport.last.verbosity).toEqual(nxLogger.DEBUG)
  })
})

