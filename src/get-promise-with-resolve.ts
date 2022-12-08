export function getPromiseWithResolve<ResolvedType = unknown>(options?: {
  timeout?: number
  timeoutErrorMessage?: string
}): {
  promise: Promise<ResolvedType>
  resolve: (value: ResolvedType) => void
  reject: (error: unknown) => void
} {
  let resolvePromise: ((value: ResolvedType) => void) | undefined
  let rejectPromise: ((error: unknown) => void) | undefined

  let rejectTimeout: ReturnType<typeof setTimeout> | undefined
  const promise = new Promise<ResolvedType>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject

    if (options?.timeout) {
      rejectTimeout = setTimeout(() => {
        reject(
          new Error(
            options.timeoutErrorMessage ??
              `Promise from getPromiseWithResolve() timed out after ${options.timeout} seconds.`
          )
        )
      }, options.timeout)
    }
  })

  if (resolvePromise === undefined || rejectPromise === undefined) {
    throw new Error(
      'Unexpected error in @mattiasahlsen/ts-utils/get-promise-with-resolve. resolvePromise or rejectPromise is is undefined, but should never be.'
    )
  }

  const alsoCancelTimeout = <Param>(
    resolveOrReject: (param: Param) => void
  ) => {
    return (param: Param) => {
      console.log('got here')
      if (rejectTimeout !== undefined) {
        console.log('clearing timeout')
        clearTimeout(rejectTimeout)
        rejectTimeout = undefined
      }
      resolveOrReject(param)
    }
  }

  return {
    promise,
    resolve: alsoCancelTimeout(resolvePromise),
    reject: alsoCancelTimeout(rejectPromise),
  }
}
