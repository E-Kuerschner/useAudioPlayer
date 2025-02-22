import { Howl, type HowlOptions as BaseHowlOptions } from "howler"

export type HowlOptions = BaseHowlOptions & {
    src: string // override src property to only be a single string
}

/**
 * A cache that tracks all the instances of AudioSources created by the library
 * An instance is cached based on the src attribute it was created with
 *
 * This prevents duplicate instances of audio being created in certain edge cases
 * React StrictMode being one such scenario
 */
class HowlCache {
    private _cache: Map<string, Howl> = new Map()

    public create(options: HowlOptions): Howl {
        const key = options.src
        if (this._cache.has(key)) {
            return this._cache.get(key)!
        }

        const howl = new Howl(options)
        this._cache.set(key, howl)
        return howl
    }

    public set(key: string, howl: Howl) {
        this._cache.set(key, howl)
    }

    public get(key: string) {
        return this._cache.get(key)
    }

    public clear(key: string) {
        this._cache.delete(key)
    }

    public destroy(key: string) {
        const howl = this.get(key)
        if (howl) {
            howl.unload()
            this.clear(key)
        }
    }

    public reset() {
        this._cache.values().forEach((audio) => audio.unload())
        this._cache.clear()
    }
}

const howlCache = new HowlCache()

export default howlCache
