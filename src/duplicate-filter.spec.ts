import { duplicateFilter } from './duplicate-filter'

describe('duplicateFilter()', () => {
  it('works for arrays with duplicate numbers', () => {
    expect([5, 3, 1, 1, 5, 9].filter(duplicateFilter)).toEqual([5, 3, 1, 9])
    expect([1, 2, '2'].filter(duplicateFilter)).toEqual([1, 2, '2'])
    expect([1, 2, undefined].filter(duplicateFilter)).toEqual([1, 2, undefined])
  })
  it('works for an empty array', () => {
    expect([].filter(duplicateFilter)).toEqual([])
  })
})
