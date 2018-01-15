
import * as util from 'util'
import { nxLogger, create, configure } from './log'
import * as faker from 'faker'

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
      transport,
      enabled,
      verbosity,
      namespace,
      tty,
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
      transport,
      enabled,
      verbosity,
      namespace,
      tty,
    })
    const x_transport = debugTransport()
    const x_enabled = !enabled
    const x_verbosity = 10 + faker.random.number({ min: 1, max: 10 })
    const x_namespace = [faker.random.word()]
    const x_tty = !tty
    const log = create({
      transport: x_transport,
      enabled: x_enabled,
      verbosity: x_verbosity,
      namespace: x_namespace,
      tty: x_tty,
    })
    expect(log.configuration.transport).toEqual(x_transport)
    expect(log.configuration.enabled).toEqual(x_enabled)
    expect(log.configuration.verbosity).toEqual(x_verbosity)
    expect(log.configuration.tty).toEqual(x_tty)
    expect(log.configuration.namespace).toEqual([...namespace, ...x_namespace])
  })
})

