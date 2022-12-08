/**
 * Returns a filter function which returns true only for one copy of each element, not for duplicates.
 * Uses the === comparison operator, so only works for primitive types.
 */
export function duplicateFilter<T>(
  element: T,
  index: number,
  elements: T[]
): boolean {
  return elements.findIndex((e) => e === element) === index
}
