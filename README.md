[![Node.js version][nodejs-badge]][nodejs]
[![NPM version][npm-badge]][npm]
[![semantic-release][semantic-release-badge]][semantic-release]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]
[![build with travis-ci][travis-badge]][travis]
[![tested with jest][jest-badge]][jest]
[![Coverage Status](https://coveralls.io/repos/github/raynode/nx-logger/badge.svg?branch=master)](https://coveralls.io/github/raynode/nx-logger?branch=master)
[![npm version](https://badge.fury.io/js/%40raynode%2Fnx-logger.svg)](https://badge.fury.io/js/%40raynode%2Fnx-logger)
[![BCH compliance](https://bettercodehub.com/edge/badge/raynode/nx-logger?branch=master)](https://bettercodehub.com/)
[![Maintainability](https://api.codeclimate.com/v1/badges/fff34fc1b31f6089213d/maintainability)](https://codeclimate.com/github/raynode/nx-logger/maintainability)

# nx-logger

nx-logger is a logging utility that grows with the application

+ [TypeScript][typescript] [2.9][typescript-29]
+ [Jest][jest] unit testing and code coverage
+ Type definitions for Node.js v6.x (LTS) and Jest

## Installation

```bash
npm i @raynode/nx-logger
```

## Migrations

As nxLogger namespace was removed, the access to the internals like interfaces or the log levels was changed.
This will result in the following being invalid:
```typescript
import { nxLogger, create } from '@raynode/nx-logger'

const log = create({ verbosity: nxLogger.DEBUG })
```

it will be like this now:
```typescript
import { LogLevel, create } from '@raynode/nx-logger'

const log = create({ verbosity: LogLevel.DEBUG })
```

Further the `nxLogger` is not necessary any more to access the interfaces
```typescript
// before
import { nxLogger } from '@raynode/nx-logger'
type myLog = nxLogger.Log

// after
import { Log } from '@raynode/nx-logger'
type myLog = Log
// or
import { Log as myLog } from '@raynode/nx-logger'
```

## Usage

Basic usage would just render some console output
```typescript
import { create } from '@raynode/nx-logger'

const log = create('my-project')

log('start-up')

```

Will run this line of console output

```javascript
console.log('my-project - start-up')
```

As I love [Debug](https://github.com/visionmedia/debug) from visionmedia, there is already a transport to transform your logging.

```typescript
import { create, configure } from '@raynode/nx-logger'
import { transport } from '@raynode/nx-logger-debug'

configure({ transport })

const log = create('my-project')

log('start-up')

```

This will now send the log message through `debug`, including the namespaces

## Features

* [Namespaces](README.md#namespaces)
* [Interchangeable transports](README.md#transports)
* [Verbosity Settings](README.md#verbosity)
* [Function-Call logging](README.md#functionhandlers)
* [Joining and splitting of transports](README.md#conditions)

### Namespaces

Each logging instance can have its own namespace.
They are designed to be inherited and used per file or per context.

You could configure it per file (with default transport)
```typescript
// app.ts
configure({ namespace: ['project'] })
const context = create('app')
// Result: project - app : msg

// utils.ts
const context = create('utils')
// Result: project - utils : msg
```

Or you can use it as per request
```typescript
configure({ namespace: ['project'] })
const appLog = create('express')
const app = express()
app.use((req, res, next) => {
  req.log = appLog(req.url)
  next()
})

app.get('/something/*', (req, res) => {
  req.log('making')
  // Result: project - express - /something/more : making
})
```


### Transports

The nx-logger is written in a way that lets you start a project and have simple logging output.
And after the project grows you'll only have to attach another transport to send the log output directly to your logging servers or services (like: [Loggly](https://www.loggly.com/)).

### Verbosity

Like in `console` there are some functions to define the verbosity of the logging call.

```typescript
const context = create({
  verbosity: 5, // default
})

context.debug('DEBUG-level: 10')
context.info('INFO-level: 7')
context.log('LOG-level: 5')
context('LOG-level: 5')
context.warn('WARN-level: 3')
context.error('ERROR-level: 1')
```

The verbosity is set per namespace to more easily debug problems during development.

### Functionhandlers

Sometime we need to know when a specific function is called, and we write code like this:
```typescript

const myFunction = (a, b) => {
  context.log('myFunction', [a, b])
  // ...
}

myFunction(1, 2) // myFunction [1, 2]
```

nx-logger has a logging handler for this case:
```typescript

const myFunction = context.on((a, b) => {
  // ...
}, 'myFunction')

myFunction(1, 2) // myFunction [1, 2]
```

The `context.on(callback, [namespace], [configuration])` feature will enable you to get information whenever the defined function is called.
Combined with the [conditions](README.md#conditions) feature it might look like this

```typescript
const signup = context.on((user: User) => db.run('create', user), 'signup-user', {
  transport: join(transport, createTransport(logglyConfiguration)),
})
```

### Conditions

When a project grows and it is necessary to enable new logging functions, it might be nice to have a possibility to join transports together.

```typescript
import { create, join } from '@raynode/nx-logger'
import { transport } from '@raynode/nx-logger-debug'
import { createTransport } from '@raynode/nx-logger-loggly'

const context = create({
  transport: join(transport, createTransport(logglyConfiguration))
})

context.log('message') // will show up in the console through debug and be transmitted to loggly via loggly-transport.
```

It might also be good to decide which messages are used in some transport

```typescript
import { create, split, LogLevel } from '@raynode/nx-logger'
import { transport } from '@raynode/nx-logger-debug'
import { createTransport } from '@raynode/nx-logger-loggly'

const decide = (configuration, messages, verbosity) => {
  if(verbosity > LogLevel.LOG)
    return true // use debug
  else
    return false // use loggly for LOG and below
}

const context = create({
  transport: split(decide, transport, createTransport(logglyConfiguration))
})

context.log('important') // will be transmitted to loggly via loggly-transport.
context.info('just infos') // will show up in the console through debug
```

## Contributing

If you want to help with this project, just leave a bugreport or pull request.
I'll try to come back to you as soon as possible

## License

MIT

[greenkeeper-badge]: https://badges.greenkeeper.io/raynode/nx-logger.svg
[greenkeeper]: https://greenkeeper.io/
[jest-badge]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest]: https://facebook.github.io/jest/
[nodejs-badge]: https://img.shields.io/badge/node->=%208.2.1-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v8.x/docs/api/
[npm-badge]: https://img.shields.io/badge/npm->=%205.4.0-blue.svg
[npm]: https://docs.npmjs.com/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[travis-badge]: https://travis-ci.org/raynode/nx-logger.svg?branch=master
[travis]: https://travis-ci.org/raynode/nx-logger
[tslint]: https://palantir.github.io/tslint/
[typescript-29]: https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#typescript-29
[typescript]: https://www.typescriptlang.org/
[typescript-badge]: https://badges.frapsoft.com/typescript/code/typescript.png?v=101
[typescript-badge-url]: https://github.com/ellerbrock/typescript-badges/
