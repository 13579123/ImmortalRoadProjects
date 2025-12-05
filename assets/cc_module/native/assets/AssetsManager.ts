import { Asset, AssetManager, assetManager } from "cc"

const ASSETS_MANAGER_MAP = new Map<string , AssetManager.Bundle>()

const REMOTE_MAP = new Map<string , any>()

export class AssetsManager {

  protected readonly CACHE_RESOURCE: Map<string , Asset|Asset[]> = new Map

  protected readonly bundleName: string = ""

  protected bundle: AssetManager.Bundle = null

  private waitingBundleList: Function[] = []

  private async waitWaitingBundleList() {
    return new Promise(res => this.waitingBundleList.push(res))
  }

  constructor(bundleName: string = "resources") {
    this.bundleName = bundleName
    if (this.bundle = ASSETS_MANAGER_MAP.get(bundleName)) return
    AssetManager.instance.loadBundle(bundleName , (err , bundle) => {
      if (err) return console.error(err)
      this.bundle = bundle
      // 清空等待数组
      this.waitingBundleList.forEach(res => res())
      this.waitingBundleList.length = 0
    })
  }

  public async preload(path: string , type?: any) {
    if (!this.bundle) await this.waitWaitingBundleList()
    const promise = new Promise(async (res , rej) => {
      this.bundle.preload(path , type , (err , data) => {
        if (err) return rej(err)
        res(data)
      })
    })
    return promise
  }

  public async preloadDir(path: string , type?: any) {
    if (!this.bundle) await this.waitWaitingBundleList()
    const promise = new Promise(async (res , rej) => {
      this.bundle.preloadDir(path , type , (err , data) => {
        if (err) return rej(err)
        res(data)
      })
    })
    return promise
  }

  public async load<T>(path: string , type?: new (...v: any) => T): Promise<T|null> {
    if (!this.bundle) await this.waitWaitingBundleList()
    if (this.CACHE_RESOURCE.get(path)) return this.CACHE_RESOURCE.get(path) as T
    const promise = new Promise<T|null>(async (res , rej) => {
      this.bundle.load(path , type as any , (err , data) => {
        if (err) return rej(err)
        res(data as T)
        this.CACHE_RESOURCE.set(path , data)
      })
    })
    return promise
  }

  public async loadDir<T>(path: string , type?: new (...v: any) => T): Promise<T[]|null> {
    if (!this.bundle) await this.waitWaitingBundleList()
    if (this.CACHE_RESOURCE.get(path)) return this.CACHE_RESOURCE.get(path) as T[]
    const promise = new Promise<T[]|null>(async (res , rej) => {
      this.bundle.loadDir(path , type as any , (err , data) => {
        if (err) return rej(err)
        res(data as T[])
        this.CACHE_RESOURCE.set(path , data)
      })
    })
    return promise
  }

  public async loadRemote<T>(path: string , options: { [k: string]: any; ext?: string; }|null = null): Promise<T> {
    if (REMOTE_MAP.get(path)) return REMOTE_MAP.get(path)
    return new Promise(res => {
      assetManager.loadRemote(path , options , (err , asset) => {
        if (err) throw err
        REMOTE_MAP.set(path , asset)
        res(asset as T)
      })
    })
  }

}