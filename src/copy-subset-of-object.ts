/**
 * Creates a new object with a subset of properties from the original object.
 */
export function copySubsetOfObject<T extends object, Key extends keyof T>(
  originalObject: T,
  keys: readonly Key[]
): Pick<T, Key> {
  return keys.reduce((acc, key) => {
    if (originalObject[key] !== undefined) {
      acc[key] = originalObject[key]
    }

    return acc
  }, {} as Pick<T, Key>)
}
