import type { Howl } from "howler"
import howlCache from "./howlCache"
import type { AudioControls } from "./types"

type Subscriber = () => void

type CreateOptions = Parameters<typeof howlCache.create>[0]

/**
 * The state (snapshot) managed by the store
 * Mutations to the state will be broadcast to all subscribers.
 */
export type Snapshot = {
    /** Indicates whether the audio is in an unloaded state. */
    readonly isUnloaded: boolean
    /** Indicates whether the audio is currently loading. */
    readonly isLoading: boolean
    /** Indicates whether the audio is loaded and ready to play. */
    readonly isReady: boolean
    /** Represents the total duration of the audio in seconds. 0 until a sound is loaded */
    readonly duration: number
    /** The playback rate of the audio. A value of 1 indicates normal playback speed. */
    readonly rate: number
    /** The volume level of the audio, typically between 0 (muted) and 1 (full volume). */
    readonly volume: number
    /** An error message, if an issue occurred with the audio. */
    readonly error?: string
    /** Indicates whether the audio is set to loop after reaching its end. */
    readonly isLooping: boolean
    /** Indicates whether the audio is currently paused. */
    readonly isPaused: boolean
    /** Indicates whether the audio is currently stopped. */
    readonly isStopped: boolean
    /** Indicates whether the audio is currently playing. */
    readonly isPlaying: boolean
    /** Indicates whether the audio is currently muted. */
    readonly isMuted: boolean
}

const defaultState: Snapshot = {
    isUnloaded: true,
    isLoading: false,
    isReady: false,
    isLooping: false,
    isPlaying: false,
    isStopped: false,
    isPaused: false,
    duration: 0,
    rate: 1,
    volume: 1,
    isMuted: false,
    error: undefined
}

export class HowlStore implements AudioControls {
    public howl: Howl | null
    public src: string | null

    private subscriptions: Set<Subscriber>
    private snapshot: Snapshot

    /**
     * Merges changes to the AudioSnapshot with the instnace variable and invokes all subscriber callbacks
     */
    private updateSnapshot(update: Partial<Snapshot>) {
        this.snapshot = {
            ...this.snapshot,
            ...update
        }

        this.subscriptions.forEach((cb) => cb())
    }

    /**
     * Initiates a snapshot update from a Howl instance
     */
    private updateSnapshotFromHowlState(howl: Howl) {
        this.updateSnapshot({
            ...this.getSnapshotFromHowl(howl)
        })
    }

    /**
     * Initializes the store with a new instance of a Howl
     *   - creates a new Howl instance
     *   - updates the AudioSnapshot instance
     *   - sets up Howl event listeners to synchronize AudioSnapshot
     */
    private initHowl(options: CreateOptions) {
        const newHowl = howlCache.create(options)
        this.src = options.src
        this.howl = newHowl

        this.updateSnapshot({
            ...this.getSnapshotFromHowl(newHowl),
            // reset error on creation of new Howl
            error: undefined
        })

        // Howl event listeners and state mutations
        newHowl.on("load", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("play", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("end", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("pause", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("stop", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("mute", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("volume", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("rate", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("seek", () => this.updateSnapshotFromHowlState(newHowl))
        newHowl.on("fade", () => this.updateSnapshotFromHowlState(newHowl))

        newHowl.on("loaderror", (_: number, errorCode: unknown) => {
            console.error(`Howl load error: ${errorCode}`)
            this.updateSnapshotFromHowlState(newHowl)
            this.updateSnapshot({
                error: "Failed to load audio source"
            })
        })

        newHowl.on("playerror", (_: number, errorCode: unknown) => {
            console.error(`Howl playback error: ${errorCode}`)
            this.updateSnapshotFromHowlState(newHowl)
            this.updateSnapshot({
                error: "Failed to play audio source"
            })
        })
    }

    private getSnapshotFromHowl(howl: Howl): Snapshot {
        const isPlaying = howl.playing()
        const muteReturn = howl.mute()
        return {
            isUnloaded: howl.state() === "unloaded",
            isLoading: howl.state() === "loading",
            isReady: howl.state() === "loaded",
            isLooping: howl.loop(),
            isPlaying,
            isStopped: !isPlaying && howl.seek() === 0,
            isPaused: !isPlaying && howl.seek() > 0,
            duration: howl.duration(),
            rate: howl.rate(),
            volume: howl.volume(),
            // the Howl#mute method sometimes returns the Howl (i.e. this) instead of the boolean
            isMuted: typeof muteReturn === "object" ? false : muteReturn
        }
    }

    constructor(options?: CreateOptions) {
        this.howl = null
        this.src = null

        this.subscriptions = new Set()
        this.snapshot = defaultState

        if (options !== undefined) {
            this.initHowl(options)
        }
    }

    public load(options: CreateOptions) {
        if (this.howl !== null) {
            this.destroy()
        }

        this.initHowl(options)
    }

    public destroy() {
        if (this.src && this.howl) {
            // guarantees that event listeners can no longer be called
            this.howl.off("load")
            this.howl.off("play")
            this.howl.off("end")
            this.howl.off("pause")
            this.howl.off("stop")
            this.howl.off("mute")
            this.howl.off("volume")
            this.howl.off("rate")
            this.howl.off("seek")
            this.howl.off("fade")
            this.howl.off("loaderror")
            this.howl.off("playerror")

            howlCache.destroy(this.src)

            this.src = null
            this.howl = null
        }
    }

    public subscribe(cb: Subscriber) {
        this.subscriptions.add(cb)
        return () => this.subscriptions.delete(cb)
    }

    public getSnapshot() {
        return this.snapshot
    }

    public play() {
        if (this.howl) {
            // prevents the Howl from spinning up a new "Sound" from the loaded audio resource
            if (this.howl.playing()) {
                return
            }

            this.howl.play()
        }
    }

    public pause() {
        if (this.howl) {
            this.howl.pause()
        }
    }

    public togglePlayPause() {
        if (this.snapshot.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    public stop() {
        if (this.howl) {
            this.howl.stop()
        }
    }

    public setVolume(vol: number) {
        if (this.howl) {
            this.howl.volume(vol)
        }
    }

    public setRate(rate: number) {
        if (this.howl) {
            this.howl.rate(rate)
        }
    }

    public loopOn() {
        if (this.howl) {
            this.howl.loop(true)
            // there is no loop even to listen for on Howl so calling the sync operation manually
            this.updateSnapshotFromHowlState(this.howl)
        }
    }

    public loopOff() {
        if (this.howl) {
            this.howl.loop(false)
            // there is no loop even to listen for on Howl so calling the sync operation manually
            this.updateSnapshotFromHowlState(this.howl)
        }
    }

    public toggleLoop() {
        if (this.snapshot.isLooping) {
            this.loopOff()
        } else {
            this.loopOn()
        }
    }

    public mute() {
        if (this.howl) {
            this.howl.mute(true)
        }
    }

    public unmute() {
        if (this.howl) {
            this.howl.mute(false)
        }
    }

    public toggleMute() {
        if (this.snapshot.isMuted) {
            this.unmute()
        } else {
            this.mute()
        }
    }

    public seek(seconds: number) {
        if (this.howl) {
            // TODO if unloaded set initial start time?
            this.howl.seek(seconds)
        }
    }

    public getPosition(): number {
        if (this.howl) {
            return this.howl.seek()
        }

        return 0
    }

    public fade(startVolume: number, endVolume: number, durationMs: number) {
        if (this.howl) {
            this.howl.fade(startVolume, endVolume, durationMs)
        }
    }
}
