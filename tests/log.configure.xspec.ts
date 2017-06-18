
import { create, configure } from '../lib/log'

describe('create', () => {
  it('should log something', () => {
    const x = create('logger')

    console.log(x('test'))
  })
})


// const a = create('A')
// a('a')

// const b = create('B')
// b('b')

// const c = a.on('log(%s)', b)

// c('c')

// a({ test: 123, a, b, c })
