const parseArgs = require('../lib/parse-args')

describe('Parse Arguments', () => {
  it('handles empty list without fail', () => {
    expect(parseArgs()).toMatchSnapshot()
  })

  it('handles install flag', () => {
    expect(parseArgs(['cmd', '--install'])).toMatchSnapshot()
  })

  it('handles no-install flag', () => {
    expect(parseArgs(['cmd', '--no-install'])).toMatchSnapshot()
  })
})
