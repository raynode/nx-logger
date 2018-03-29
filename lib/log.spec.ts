
// tslint:disable-next-line
import * as faker from 'faker'

import * as util from 'util'
import { configure, create } from './log.initial'

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
  it('should set the configuration for the logger created by create', () => {
    const transport = debugTransport()
    const enabled = faker.random.boolean()
    const verbosity = faker.random.number({ min: 1, max: 10 })
    const namespace = [faker.random.word()]
    const tty = faker.random.boolean()
    configure({
      enabled,
      namespace,
      transport,
      tty,
      verbosity,
    })
    const log = create()
    expect(log.configuration.transport).toEqual(transport)
    expect(log.configuration.enabled).toEqual(enabled)
    expect(log.configuration.verbosity).toEqual(verbosity)
    expect(log.configuration.namespace).toEqual(namespace)
    expect(log.configuration.tty).toEqual(tty)
  })

  it('should be a baseline and all options should be changeable within create', () => {
    const transport = debugTransport()
    const enabled = faker.random.boolean()
    const verbosity = faker.random.number({ min: 1, max: 10 })
    const namespace = [faker.random.word()]
    const tty = faker.random.boolean()
    configure({
      enabled,
      namespace,
      transport,
      tty,
      verbosity,
    })
    const nextTransport = debugTransport()
    const nextEnabled = !enabled
    const nextVerbosity = 10 + faker.random.number({ min: 1, max: 10 })
    const nextNamespace = [faker.random.word()]
    const nextTty = !tty
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
    expect(log.configuration.namespace).toEqual([...namespace, ...nextNamespace])
  })
})
