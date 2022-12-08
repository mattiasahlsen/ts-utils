/**
 * Returns an array of numbers in the given range. Similar to Python's range function.
 * If only one argument is passed, it must be a positive number.
 * If two arguments are passed, the second argument must be larger than the first argument.
 * The arguments must be integers.
 */
export function range(toOrFrom: number, toParameter?: number): number[] {
  const from = typeof toParameter === 'number' ? toOrFrom : 0
  const to = toParameter ?? toOrFrom
  return [...Array(to - from).keys()].map((n) => n + from)
}
