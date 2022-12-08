import { range } from './range'

describe('range()', () => {
  it('goes from 0 to the argument - 1 if only one argument is passed', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4])
  })
  it('goes from the first argument to the second argument - 1 if two arguments are passed', () => {
    expect(range(2, 7)).toEqual([2, 3, 4, 5, 6])
  })
  it('works with negative numbers', () => {
    expect(range(-5, -2)).toEqual([-5, -4, -3])
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1])
  })
  it('works for 0', () => {
    expect(range(0)).toEqual([])
    expect(range(0, 0)).toEqual([])
  })
})
