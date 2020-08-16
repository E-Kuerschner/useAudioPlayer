import { useCallback, useContext, useEffect } from "react"
import { Howl } from "howler"
import { context } from "./context"
import { AudioPlayerContext, AudioOptions } from "./types"

const noop = () => {}

export type AudioPlayerControls = Omit<AudioPlayerContext, "player"> & {
    play: Howl["play"] | typeof noop
    pause: Howl["pause"] | typeof noop
    stop: Howl["stop"] | typeof noop
    mute: Howl["mute"] | typeof noop
    volume: Howl["volume"] | typeof noop
    seek: (position?: number) => number
    togglePlayPause: () => void
}

export const useAudioPlayer = (options?: AudioOptions): AudioPlayerControls => {
    const { player, load, ...rest } = useContext(context)!

    const { src, ...restOptions } = options || {}

    useEffect(() => {
        // if useAudioPlayer is called without arguments
        // don't do anything: the user will have access
        // to the current context
        if (!src) return
        load({ src, ...restOptions })
    }, [src, restOptions, load])

    const togglePlayPause = useCallback(() => {
        if (!player) return

        if (player.playing()) {
            player.pause()
        } else {
            player.play()
        }
    }, [player])

    const seek: AudioPlayerControls["seek"] = useCallback(
        position => {
            if (!player) return 0

            // it appears that howler returns the Howl object when seek is given a position
            // to get the latest potion you must call seek again with no parameters
            const result = player.seek(position) as Howl
            return result.seek() as number
        },
        [player]
    )

    return {
        ...rest,
        play: player ? player.play.bind(player) : noop,
        pause: player ? player.pause.bind(player) : noop,
        stop: player ? player.stop.bind(player) : noop,
        mute: player ? player.mute.bind(player) : noop,
        volume: player ? player.volume.bind(player) : noop,
        seek,
        load,
        togglePlayPause
    }
}
