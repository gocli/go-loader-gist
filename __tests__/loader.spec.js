const mockIsValidSource = jest.fn()
jest.mock('../lib/is-valid-source', () => mockIsValidSource)
const mockIsValidTarget = jest.fn()
jest.mock('../lib/is-valid-target', () => mockIsValidTarget)
const mockLoadGistFiles = jest.fn()
jest.mock('../lib/load-gist-files', () => mockLoadGistFiles)
const mockParseArgs = jest.fn()
jest.mock('../lib/parse-args', () => mockParseArgs)
const mockSaveFiles = jest.fn()
jest.mock('../lib/save-files', () => mockSaveFiles)

const loader = require('../lib/loader')

describe('Loader', () => {
  const args = {}
  const source = 'SOURCE'
  const destination = 'DESTINATION'
  const cwd = 'cwd'
  const logBackup = console.log
  const cwdBackup = process.cwd

  beforeEach(() => {
    console.log = jest.fn()
    process.cwd = jest.fn()

    mockIsValidSource.mockReset()
    mockIsValidTarget.mockReset()
    mockLoadGistFiles.mockReset()
    mockParseArgs.mockReset()
    mockSaveFiles.mockReset()

    process.cwd.mockReturnValue(cwd)
    mockIsValidSource.mockReturnValue(true)
    mockIsValidTarget.mockResolvedValue(null)
    mockLoadGistFiles.mockResolvedValue([{ filename: 'f1', content: 'c1' }])
    mockParseArgs.mockReturnValue({
      _: ['gist', source, destination],
      install: true
    })
    mockSaveFiles.mockResolvedValue(['dst/f1'])
  })

  afterEach(() => {
    console.log = logBackup
    process.cwd = cwdBackup
  })

  it('works as expected', () => {
    const files = [
      { filename: 'f1', content: 'c1' },
      { filename: 'f2', content: 'c2' }
    ]

    const filePaths = [ 'dst/f1', 'dst/f2' ]

    mockLoadGistFiles.mockResolvedValue(files)
    mockSaveFiles.mockResolvedValue(filePaths)

    return loader.execute(args)
      .then(result => {
        expect(mockIsValidSource).toHaveBeenCalledTimes(1)
        expect(mockIsValidSource).toHaveBeenCalledWith(source)

        expect(mockIsValidTarget).toHaveBeenCalledTimes(1)
        expect(mockIsValidTarget).toHaveBeenCalledWith(destination)

        expect(console.log).toHaveBeenCalledWith('loading files...')

        expect(mockLoadGistFiles).toHaveBeenCalledWith(source)

        expect(mockSaveFiles).toHaveBeenCalledWith(files, destination)

        expect(console.log)
          .toHaveBeenCalledWith('2 file(s) were created:\n dst/f1\n dst/f2')

        expect(result).toEqual({ path: destination, install: true })
      })
  })

  it('rejects if source is not specified', () => {
    mockParseArgs.mockReturnValue({ _: ['gist'] })
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load: gist is not specified')
  })

  it('rejects if source is invalid', () => {
    mockIsValidSource.mockReturnValue(false)
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load: source suppose to be a valid gist hash')
  })

  it('rejects if given destination can not be used to store files', () => {
    mockIsValidTarget.mockRejectedValue(new Error('you shell not pass'))
    return expect(loader.execute(args))
      .rejects.toThrow('you shell not pass')
  })

  it('resolves if destination is not specified', () => {
    mockParseArgs.mockReturnValue({ _: ['gist', source] })
    mockLoadGistFiles.mockResolvedValue([{ filename: 'f1', content: 'c1' }])
    return loader.execute(args)
      .then(result => {
        expect(mockSaveFiles)
          .toHaveBeenCalledWith([{ filename: 'f1', content: 'c1' }], cwd)
        expect(result).toEqual({ install: undefined, path: cwd })
      })
  })

  it('hide path to current directory in output log', () => {
    mockSaveFiles.mockResolvedValue([`${cwd}/f1`])
    return loader.execute(args)
      .then(result => {
        expect(console.log)
          .toHaveBeenCalledWith('1 file(s) were created:\n f1')
      })
  })

  it('rejects if text was thrown during execution', () => {
    mockIsValidTarget.mockRejectedValue('some text')
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load: \'some text\'')
  })
})
