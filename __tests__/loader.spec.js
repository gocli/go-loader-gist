const mockIsValidTarget = jest.fn()
jest.mock('../lib/is-valid-target', () => mockIsValidTarget)
const mockParseArgs = jest.fn()
jest.mock('../lib/parse-args', () => mockParseArgs)

const loader = require('../lib/loader')

describe('Loader', () => {
  const args = {}
  const source = 'SOURCE'
  const destination = 'DESTINATION'

  beforeEach(() => {
    mockIsValidTarget.mockReset()
    mockParseArgs.mockReset()

    mockIsValidTarget.mockResolvedValue(null)
    mockParseArgs.mockReturnValue({
      _: ['gist', source, destination],
      install: true
    })
  })

  it('rejects if source is not specified', () => {
    mockParseArgs.mockReturnValue({ _: ['gist'] })
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load: source is not specified')
  })

  it('rejects if destination is not specified', () => {
    mockParseArgs.mockReturnValue({ _: ['gist', source] })
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load: destination is not specified')
  })

  it('validates destination given in arguments', () => {
    return loader.execute(args)
      .then(() => {
        expect(mockIsValidTarget).toHaveBeenCalledTimes(1)
        expect(mockIsValidTarget).toHaveBeenCalledWith(destination)
      })
  })

  it('resolves with the object containing setup path and install flag', () => {
    return expect(loader.execute(args))
      .resolves.toEqual({ path: destination, install: true })
  })

  it('rejects if isValidTarget() rejects', () => {
    const err = 'validation error'
    mockIsValidTarget.mockRejectedValue(new Error(err))
    return expect(loader.execute(args))
      .rejects.toThrow(`failed to load source because of '${err}'`)
  })
})
