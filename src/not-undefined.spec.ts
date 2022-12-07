import { notUndefined } from './not-undefined'
describe('not-undefined', () => {
  it('should return true if the value is not undefined', () => {
    expect(notUndefined(1)).toBe(true)
  })

  it('should return false if the value is undefined', () => {
    expect(notUndefined(undefined)).toBe(false)
  })
})
