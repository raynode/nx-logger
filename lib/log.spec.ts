
// tslint:disable-next-line
import * as faker from 'faker'

import * as util from 'util'
import { configure, create, DEBUG } from './index'

import { debugTransport } from '../test-utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10

describe('options', () => {
  it('should not send any msg if the logger is not enabled', () => {
    const transport = debugTransport()
    const log = create({ transport, enabled: false })
    const msg = faker.random.word()
    log.debug(msg)
    expect(transport.called).toEqual(0)
  })
})

describe('configure', () => {
  const generateConfiguration = () => ({
    enabled: faker.random.boolean(),
    namespace: [faker.random.word()],
    transport: debugTransport('auto-debug'),
    tty: faker.random.boolean(),
    verbosity: faker.random.number({ min: 1, max: 10 }),
  })

  it('should set the configuration for the logger created by create', () => {
    const configuration = generateConfiguration()
    configure(configuration)
    const log = create()
    expect(log.configuration().transport).toEqual(configuration.transport)
    expect(log.configuration().enabled).toEqual(configuration.enabled)
    expect(log.configuration().verbosity).toEqual(configuration.verbosity)
    expect(log.configuration().namespace).toEqual(configuration.namespace)
    expect(log.configuration().tty).toEqual(configuration.tty)
  })

  it('should set the configuration for the logger created by create and a second time', () => {
    const configuration = generateConfiguration()
    configure(configuration)
    const log = create()
    expect(log.configuration().transport).toEqual(configuration.transport)
    expect(log.configuration().enabled).toEqual(configuration.enabled)
    expect(log.configuration().verbosity).toEqual(configuration.verbosity)
    expect(log.configuration().namespace).toEqual(configuration.namespace)
    expect(log.configuration().tty).toEqual(configuration.tty)
  })

  it('should be a baseline and all options should be changeable within create', () => {
    const configuration = generateConfiguration()
    configure(configuration)
    const nextTransport = debugTransport()
    const nextEnabled = !configuration.enabled
    const nextVerbosity = 10 + faker.random.number({ min: 1, max: 10 })
    const nextNamespace = [faker.random.word()]
    const nextTty = !configuration.tty
    const log = create({
      enabled: nextEnabled,
      namespace: nextNamespace,
      transport: nextTransport,
      tty: nextTty,
      verbosity: nextVerbosity,
    })
    expect(log.configuration().transport).toEqual(nextTransport)
    expect(log.configuration().enabled).toEqual(nextEnabled)
    expect(log.configuration().verbosity).toEqual(nextVerbosity)
    expect(log.configuration().tty).toEqual(nextTty)
    expect(log.configuration().namespace).toEqual([...configuration.namespace, ...nextNamespace])
  })

  it('should bubble through to the base configuration when a value was not changed', () => {
    const configuration = generateConfiguration()
    const trans1 = debugTransport('t1')
    const trans2 = debugTransport('t2')
    configuration.transport = trans1
    configuration.verbosity = DEBUG
    configure(configuration)
    const log1 = create()
    const log2 = log1.create({ namespace: ['level 2'], transport: trans2 })
    const log3 = log1.create('level 3')
    expect(trans1.called).toBe(0)
    expect(trans2.called).toBe(0)
    log2(faker.random.word())
    expect(trans1.called).toBe(0)
    expect(trans2.called).toBe(1)
    log1(faker.random.word())
    expect(trans1.called).toBe(1)
    expect(trans2.called).toBe(1)
    log3(faker.random.word()) // should use trans1
    expect(trans1.called).toBe(2)
    expect(trans2.called).toBe(1)
    log1.update({ transport: trans2 })
    log1(faker.random.word())
    expect(trans1.called).toBe(2)
    expect(trans2.called).toBe(2)
    log3(faker.random.word()) // it should now fall back to the log fn of log1
    expect(trans1.called).toBe(2)
    expect(trans2.called).toBe(3)
  })
})
