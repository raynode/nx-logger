[![Node.js version][nodejs-badge]][nodejs]
[![NPM version][npm-badge]][npm]
[![tested with jest][jest-badge]][jest]
[![build with travis-ci][travis-badge]][travis]
[![semantic-release][semantic-release-badge]][semantic-release]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]

# nx-logger

This is a graphql server-ish module that enables you to run a graphql resolver anywhere. This is thought to be used in the browser as a first step to integrating graphql later in the production cycle.

+ [TypeScript][typescript] [2.5][typescript-25] to ES6 transpilation
+ [TSLint][tslint] 5.x
+ [Jest][jest] unit testing and code coverage
+ Type definitions for Node.js v6.x (LTS) and Jest
+ .editorconfig for consistent file format

## Getting Started

Install nx-logger using npm:

```
npm i @raynode/nx-logger
```

## Usage

```
import { createServer } from 'nx-logger'

const { client } = createServer({ typeDefs, resolver })
```

```
import { queryRequestFactory, queryFactory, createClient, createServer } from 'nx-logger'
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
[typescript-25]: https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#typescript-25
[typescript]: https://www.typescriptlang.org/
