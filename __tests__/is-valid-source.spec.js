const isValidSource = require('../lib/is-valid-source')

describe('Is Valid Source', () => {
  it('returns true when hash is given', () => {
    expect(isValidSource('a9c61f0')).toBe(true)
    expect(isValidSource('0')).toBe(true)
  })

  it('returns false if invalid hash is given', () => {
    expect(isValidSource('h9c61f0')).toBe(false)
    expect(isValidSource('a9c-61f0')).toBe(false)
  })

  it('returns true if hash is given with version sha', () => {
    expect(isValidSource('a9c61f0/8b25ec')).toBe(true)
    expect(isValidSource('a9c61f0/d')).toBe(true)
  })

  it('returns false if hash is given with invalid version', () => {
    expect(isValidSource('a9c61f0/hb25ec')).toBe(false)
    expect(isValidSource('a9c61f0/-b25ec')).toBe(false)
    expect(isValidSource('a9c61f0/')).toBe(false)
    expect(isValidSource('/8b25ec')).toBe(false)
  })
})
