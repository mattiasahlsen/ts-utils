import { copySubsetOfObject } from './copy-subset-of-object'

describe('copySubsetOfObject()', () => {
  it('copies the subset of properties from the original object', () => {
    const originalObject = {
      a: 1,
      b: 2,
      c: 3,
    }

    expect(copySubsetOfObject(originalObject, ['a', 'c'])).toEqual({
      a: 1,
      c: 3,
    })
  })
})
