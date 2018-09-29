const mockFs = {
  writeFile: jest.fn()
}
jest.mock('fs', () => mockFs)
const mockMkdirp = {
  sync: jest.fn()
}
jest.mock('mkdirp', () => mockMkdirp)
const saveFiles = require('../lib/save-files')

describe('Save Files', () => {
  const defaultError = 'not implemented'
  const defaultEncoding = 'utf8'

  beforeEach(() => {
    mockFs.writeFile.mockReset()
    mockMkdirp.sync.mockReset()

    mockFs.writeFile.mockImplementation((p, c, e, cb) => {
      cb(new Error(defaultError))
    })
  })

  it('works as expected', () => {
    mockFs.writeFile.mockImplementation((p, c, e, cb) => cb())
    const files = [
      { filename: 'f1', content: 'c1' },
      { filename: 'f2', content: 'c2' }
    ]
    return saveFiles(files, 'destination')
      .then(paths => {
        expect(paths).toEqual(['destination/f1', 'destination/f2'])
        expect(mockFs.writeFile).toHaveBeenCalledTimes(2)
        expect(mockFs.writeFile.mock.calls[0].slice(0, 3))
          .toEqual(['destination/f1', 'c1', defaultEncoding])
        expect(mockFs.writeFile.mock.calls[1].slice(0, 3))
          .toEqual(['destination/f2', 'c2', defaultEncoding])
      })
  })

  it('fails if no files given', () => {
    return expect(saveFiles([], 'destination'))
      .rejects.toThrow('Gist doesn\'t contain files')
  })

  it('fails if could not write a file to file system', () => {
    return expect(saveFiles([{ filename: 'f1', content: 'c1' }], 'destination'))
      .rejects.toThrow(defaultError)
  })
})
