const mockHttps = { get: jest.fn() }
jest.mock('https', () => mockHttps)

const EventEmitter = require('events')
const { Readable } = require('stream')
const load = require('../lib/load')

const createStream = string => new Readable({
  read () {
    this.pos = this.pos || 0
    this.push(string[this.pos++])
    if (this.pos === string.length) {
      this.push(null)
    }
  }
})

describe('Load', () => {
  const content = 'content'
  let stream
  let request

  beforeEach(() => {
    stream = createStream(content)
    request = new EventEmitter()

    mockHttps.get.mockReset()
    mockHttps.get.mockImplementation((o, cb) => {
      request.end = () => cb(stream)
      return request
    })
  })

  it('works as expected', () => {
    return load('link').then(data => {
      expect(mockHttps.get).toHaveBeenCalledTimes(1)
      expect(mockHttps.get.mock.calls[0][0]).toBe('link')
      expect(data).toBe(content)
    })
  })

  it('fails if request fails', () => {
    const loading = load('link')
    request.emit('error', 'FAIL')
    return expect(loading).rejects.toThrow('FAIL')
  })
})
