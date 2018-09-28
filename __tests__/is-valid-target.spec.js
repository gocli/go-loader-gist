const mockFs = {
  readdir: jest.fn(),
  stat: jest.fn()
}
jest.mock('fs', () => mockFs)
const isValidTarget = require('../lib/is-valid-target')

describe('Is Valid Target', () => {
  const path = 'specific/path'
  const mockStat = jest.fn()
  const mockDir = jest.fn()
  const dirStat = { isDirectory: () => true }
  const fileStat = { isDirectory: () => false }

  beforeEach(() => {
    mockFs.readdir.mockReset()
    mockFs.stat.mockReset()

    mockStat.mockReturnValue(null)
    mockFs.stat.mockImplementation((p, cb) => {
      const stat = mockStat()
      cb(stat ? null : 'error', stat)
    })

    mockDir.mockReturnValue([])
    mockFs.readdir.mockImplementation((p, cb) => {
      const content = mockDir()
      cb(content ? null : 'error', content)
    })
  })

  it('calls to stat to check if given path exists', () => {
    return isValidTarget(path)
      .then(() => {
        expect(mockFs.stat).toHaveBeenCalledTimes(1)
        expect(mockFs.stat.mock.calls[0][0]).toBe(path)
      })
  })

  it('resolves if stat does not find anything', () => {
    mockStat.mockReturnValue(null)
    return isValidTarget(path)
      .then((res) => {
        expect(res).toBe(undefined)
      })
  })

  it('calls to readdir if directory path is given', () => {
    mockStat.mockReturnValue(dirStat)
    return isValidTarget(path)
      .then(() => {
        expect(mockFs.readdir).toHaveBeenCalledTimes(1)
        expect(mockFs.readdir.mock.calls[0][0]).toBe(path)
      })
  })

  it('rejects if file path is given', () => {
    mockStat.mockReturnValue(fileStat)
    return expect(isValidTarget(path)).rejects.toThrow(`'${path}' is a file`)
  })

  it('rejects if reading from dir is failing', () => {
    mockStat.mockReturnValue(dirStat)
    mockDir.mockReturnValue(null)
    return expect(isValidTarget(path))
      .rejects.toThrow(`can not access '${path}' because of 'error'`)
  })

  it('rejects if dir is not empty', () => {
    mockStat.mockReturnValue(dirStat)
    mockDir.mockReturnValue(['file'])
    return expect(isValidTarget(path))
      .rejects.toThrow(`'${path}' is not empty`)
  })
})
