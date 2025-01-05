import { Howl, type HowlOptions } from "howler"

import type { AudioLoadOptions } from "./types"
import { type Action, ActionTypes } from "./audioPlayerState"

export type AudioActionCallback = (action: Action) => void

export class HowlInstanceManager {
    private callbacks: Map<string, AudioActionCallback> = new Map()
    private howl: Howl | undefined = undefined
    private options: AudioLoadOptions = {}
    private subscriptionIndex = 0

    public subscribe(cb: AudioActionCallback): string {
        const id = (this.subscriptionIndex++).toString()
        this.callbacks.set(id, cb)
        return id
    }

    public unsubscribe(subscriptionId: string) {
        this.callbacks.delete(subscriptionId)
    }

    public getHowl() {
        return this.howl
    }

    public getNumberOfConnections() {
        return this.callbacks.size
    }

    public createHowl(options: { src: string } & AudioLoadOptions) {
        this.destroyHowl()

        this.options = options
        const { initialVolume, initialRate, initialMute, ...rest } =
            this.options
        const newHowl = new Howl({
            mute: initialMute,
            volume: initialVolume,
            rate: initialRate,
            ...rest
        } as HowlOptions)

        this.callbacks.forEach((cb) =>
            cb({ type: ActionTypes.START_LOAD, howl: newHowl })
        )
        this.howl = newHowl
        return newHowl
    }

    public destroyHowl() {
        if (this.options.onload) {
            this.howl?.off("load", this.options.onload)
        }

        if (this.options.onend) {
            this.howl?.off("end", this.options.onend)
        }

        if (this.options.onplay) {
            this.howl?.off("play", this.options.onplay)
        }

        if (this.options.onpause) {
            this.howl?.off("pause", this.options.onpause)
        }

        if (this.options.onstop) {
            this.howl?.off("stop", this.options.onstop)
        }

        this.howl?.unload()
    }

    public broadcast(action: Action) {
        this.callbacks.forEach((cb) => cb(action))
    }
}

export class HowlInstanceManagerSingleton {
    private static instance: HowlInstanceManager

    public static getInstance() {
        if (this.instance === undefined) {
            HowlInstanceManagerSingleton.instance = new HowlInstanceManager()
        }

        return HowlInstanceManagerSingleton.instance
    }
}
