
// tslint:disable-next-line
import * as faker from 'faker'

import * as util from 'util'
import { configure, create } from './index'

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
    transport: debugTransport(),
    enabled: faker.random.boolean(),
    verbosity: faker.random.number({ min: 1, max: 10 }),
    namespace: [faker.random.word()],
    tty: faker.random.boolean(),
  })



  it('should set the configuration for the logger created by create', () => {
    const configuration = generateConfiguration()
    configure(configuration)
    const log = create()
    expect(log.configuration.transport).toEqual(configuration.transport)
    expect(log.configuration.enabled).toEqual(configuration.enabled)
    expect(log.configuration.verbosity).toEqual(configuration.verbosity)
    expect(log.configuration.namespace).toEqual(configuration.namespace)
    expect(log.configuration.tty).toEqual(configuration.tty)
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
    expect(log.configuration.transport).toEqual(nextTransport)
    expect(log.configuration.enabled).toEqual(nextEnabled)
    expect(log.configuration.verbosity).toEqual(nextVerbosity)
    expect(log.configuration.tty).toEqual(nextTty)
    expect(log.configuration.namespace).toEqual([...configuration.namespace, ...nextNamespace])
  })
})
