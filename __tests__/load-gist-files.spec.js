const mockLoad = jest.fn()
jest.mock('../lib/load', () => mockLoad)
const loadGistFiles = require('../lib/load-gist-files')

const createArray = (size, valueFn) => {
  const arr = new Array(size)
  for (let i = 0; i < size; i++) arr[i] = valueFn(i)
  return arr
}

const genFilesResponse = n => JSON.stringify({
  files: createArray(n, i => ({
    filename: `file-${i}`,
    content: `content-${i}`,
    raw_url: `link-${i}`,
    truncated: !!(i % 2)
  }))
})

const genErrResponse = message => JSON.stringify({ message })

const genInvalidResponse = () => 'Not a JSON string'

describe('Load Gist Files', () => {
  const defaultError = 'not implemented'
  beforeEach(() => {
    mockLoad.mockReset()
    mockLoad.mockResolvedValue(genErrResponse(defaultError))
  })

  it('works as expected', () => {
    mockLoad.mockResolvedValueOnce(genFilesResponse(1))
    return loadGistFiles('path')
      .then(files => {
        expect(files).toEqual([
          { filename: 'file-0',
            content: 'content-0',
            raw_url: 'link-0',
            truncated: false }
        ])
      })
  })

  it('loads truncated files', () => {
    mockLoad.mockResolvedValueOnce(genFilesResponse(2))
    mockLoad.mockResolvedValueOnce('content-1-full')

    return loadGistFiles('path').then(files => {
      expect(mockLoad).toHaveBeenCalledTimes(2)
      expect(mockLoad).toHaveBeenCalledWith({
        headers: { 'User-Agent': 'NodeJS' },
        hostname: 'api.github.com',
        path: `/gists/path`
      })
      expect(mockLoad).toHaveBeenCalledWith('link-1')

      expect(files).toEqual([
        { filename: 'file-0',
          content: 'content-0',
          raw_url: 'link-0',
          truncated: false },
        { filename: 'file-1',
          content: 'content-1-full',
          raw_url: 'link-1',
          truncated: false }
      ])
    })
  })

  it('falis when response is not a valid JSON', () => {
    mockLoad.mockResolvedValue(genInvalidResponse())
    return expect(loadGistFiles('path'))
      .rejects.toThrow(SyntaxError)
  })

  it('fails if load failed', () => {
    return expect(loadGistFiles('path'))
      .rejects.toThrow(defaultError)
  })

  it('fails if specific file can not be loaded', () => {
    mockLoad.mockResolvedValueOnce(genFilesResponse(2))
    mockLoad.mockRejectedValueOnce(new Error('fail to load specific file'))
    const loading = loadGistFiles('path')
      .catch(err => {
        expect(mockLoad).toHaveBeenCalledTimes(2)
        expect(mockLoad).toHaveBeenCalledWith({
          headers: { 'User-Agent': 'NodeJS' },
          hostname: 'api.github.com',
          path: `/gists/path`
        })
        expect(mockLoad).toHaveBeenCalledWith('link-1')
        throw err
      })

    return expect(loading).rejects.toThrow('fail to load specific file')
  })
})
