import { mock } from 'jest-mock-extended'
import { DependencyManager } from './dependency-manager'

describe('dependency-injection.service', () => {
  it('should be able to load and get a dependency', async () => {
    const dependencyManager = new DependencyManager()
    const mockTestService = mock()
    dependencyManager.registerService('$testService', mockTestService)
    const loadedDependency = await dependencyManager.getDependency(
      '$testService',
      { from: '$aggregatorService' }
    )
    expect(loadedDependency).toBe(mockTestService)
  })

  it('should be able to get a dependency that is loaded later', () => {
    const dependencyManager = new DependencyManager()
    const mockTestService = mock()
    const loadedDependency = dependencyManager.getDependency('$testService', {
      from: '$aggregatorService',
    })
    dependencyManager.registerService('$testService', mockTestService)
    return expect(loadedDependency).resolves.toBe(mockTestService)
  })

  it('should be able to load and get a dependency multiple times', async () => {
    const dependencyManager = new DependencyManager()
    const mockTestService = mock()
    dependencyManager.registerService('$testService', mockTestService)
    const loadedDependency = await dependencyManager.getDependency(
      '$testService',
      { from: '$aggregatorService' }
    )
    expect(loadedDependency).toBe(mockTestService)
    const loadedDependency2 = await dependencyManager.getDependency(
      '$testService',
      { from: '$aggregatorService' }
    )
    expect(loadedDependency2).toBe(mockTestService)
  })

  it('should be able to load and get a dependency multiple times with different instances', async () => {
    const dependencyManager = new DependencyManager()
    const mockTestService = mock()
    const mockTestService2 = mock()
    dependencyManager.registerService('$testService', mockTestService)
    const loadedDependency = await dependencyManager.getDependency(
      '$testService',
      { from: '$aggregatorService' }
    )
    expect(loadedDependency).toBe(mockTestService)
    dependencyManager.registerService('$testService', mockTestService2)
    const loadedDependency2 = await dependencyManager.getDependency(
      '$testService',
      { from: '$aggregatorService' }
    )
    expect(loadedDependency2).toBe(mockTestService2)
  })

  it('finds circular dependencies', () => {
    const dependencyManager = new DependencyManager()
    dependencyManager.getDependency('$testService', {
      from: '$aggregatorService',
    })
    dependencyManager.getDependency('$aggregatorService', {
      from: '$testService',
    })
    expect(() =>
      dependencyManager.findCircularDependencies('$testService')
    ).toThrowError(/Circular dependencies found: .*\$testService/)
  })

  it('finds nested dependencies with multiple dependencies', () => {
    const dependencyManager = new DependencyManager()
    dependencyManager.getDependency('$testService', {
      from: '$aggregatorService',
    })
    dependencyManager.getDependency('$pimService', {
      from: '$testService',
    })
    dependencyManager.getDependency('$aggregatorService', {
      from: '$testService',
    })
    expect(() =>
      dependencyManager.findCircularDependencies('$testService')
    ).toThrowError(/Circular dependencies found: .*\$testService/)
  })

  it('finds deeply nested circulardependencies', () => {
    const dependencyManager = new DependencyManager()
    dependencyManager.getDependency('$testService', {
      from: '$aggregatorService',
    })
    dependencyManager.getDependency('$pimService', {
      from: '$testService',
    })
    dependencyManager.getDependency('$contentService', {
      from: '$pimService',
    })
    dependencyManager.getDependency('$aggregatorService', {
      from: '$contentService',
    })

    expect(() =>
      dependencyManager.findCircularDependencies('$testService')
    ).toThrowError(/Circular dependencies found: .*\$testService/)
  })

  it('times out if a dependency is not loaded within the defined time', async () => {
    const dependencyManager = new DependencyManager({ timeoutSeconds: 1 })
    let error: Error | undefined
    dependencyManager
      .getDependency('$testService', {
        from: '$aggregatorService',
      })
      .catch((err) => {
        error = err
      })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toMatch(/timed out.*1 seconds/)
  })
})
