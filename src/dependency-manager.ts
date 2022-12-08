import { getPromiseWithResolve } from './get-promise-with-resolve'

export interface IDependencyManager<
  ServiceKey extends string = string,
  ServiceKeyToServiceMap extends Record<string, unknown> = Record<
    string,
    unknown
  >,
  Service = ServiceKeyToServiceMap[ServiceKey]
> {
  registerService(serviceKey: ServiceKey, service: Service): void
  getDependency<Key extends ServiceKey>(
    serviceKey: Key,
    options: { from: ServiceKey }
  ): Promise<ServiceKeyToServiceMap[Key]>
  findCircularDependencies(serviceKey: ServiceKey): void
}

export class DependencyManager<
  ServiceKey extends string = string,
  ServiceKeyToServiceMap extends Record<string, unknown> = Record<
    string,
    unknown
  >,
  Service = ServiceKeyToServiceMap[ServiceKey]
> implements IDependencyManager<ServiceKey, ServiceKeyToServiceMap, Service>
{
  private serviceStore = new Map<
    ServiceKey,
    {
      resolve: (service: Service) => void
      promise: Promise<Service>
      dependsOn: Set<ServiceKey>
    }
  >()

  private timeout: number | undefined

  constructor(options?: { timeoutSeconds?: number }) {
    const timeoutSeconds = options?.timeoutSeconds
    this.timeout = timeoutSeconds && timeoutSeconds * 1000
  }

  registerService(serviceKey: ServiceKey, service: Service): void {
    const fromStore = this.serviceStore.get(serviceKey)
    if (fromStore) {
      fromStore.resolve(service)
    } else {
      const storeEntry = {
        promise: Promise.resolve(service),
        resolve(service: Service) {
          this.promise = Promise.resolve(service)
        },
        dependsOn: new Set<ServiceKey>(),
      }
      this.serviceStore.set(serviceKey, storeEntry)
    }
  }

  getDependency<Key extends ServiceKey>(
    serviceKey: Key,
    options: { from: ServiceKey }
  ): Promise<ServiceKeyToServiceMap[Key]> {
    const fromStore = this.serviceStore.get(serviceKey)
    if (fromStore) {
      fromStore.dependsOn.add(options.from)
      return fromStore.promise as Promise<ServiceKeyToServiceMap[Key]>
    } else {
      const { promise, resolve } = getPromiseWithResolve<Service>(
        this.timeout
          ? {
              timeout: this.timeout,
              timeoutErrorMessage: `Dependency ${serviceKey} timed out after not being registered for ${
                this.timeout / 1000
              } seconds.`,
            }
          : undefined
      )
      this.serviceStore.set(serviceKey, {
        promise,
        resolve,
        dependsOn: new Set([options.from]),
      })
      return promise as Promise<ServiceKeyToServiceMap[Key]>
    }
  }

  findCircularDependencies(serviceKey: ServiceKey) {
    const visited = new Set<ServiceKey>()
    const stack: ServiceKey[] = []
    const circularDependencies: ServiceKey[] = []

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const serviceThis = this

    function visit(serviceKey: ServiceKey) {
      if (visited.has(serviceKey)) {
        return
      }

      visited.add(serviceKey)
      stack.push(serviceKey)

      const service = serviceThis.serviceStore.get(serviceKey)
      if (service) {
        for (const dependency of service.dependsOn) {
          if (stack.includes(dependency)) {
            circularDependencies.push(dependency)
          } else {
            visit(dependency)
          }
        }
      }

      stack.pop()
    }

    visit(serviceKey)

    if (circularDependencies.length > 0) {
      throw new Error(
        'Circular dependencies found: ' + circularDependencies.join(', ')
      )
    }
  }
}
