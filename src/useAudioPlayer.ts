import { useCallback, useContext, useEffect } from "react"
import { AudioPlayerContext } from "./context"
import { AudioPlayer, AudioSrcProps } from "./types"

const noop = () => {}

type AudioPlayerControls = Omit<AudioPlayer, "player"> & {
    play: Howl["play"] | typeof noop
    pause: Howl["pause"] | typeof noop
    stop: Howl["stop"] | typeof noop
    mute: Howl["mute"] | typeof noop
    seek: Howl["seek"] | typeof noop
    togglePlayPause: () => void
}

export const useAudioPlayer = (props?: AudioSrcProps): AudioPlayerControls => {
    const { player, load, ...context } = useContext(AudioPlayerContext)!

    const { src, format, autoplay } = props || {}

    useEffect(() => {
        // if useAudioPlayer is called without arguments
        // don't do anything: the user will have access
        // to the current context
        if (!src) return
        load({ src, format, autoplay })
    }, [src, format, autoplay, load])

    const togglePlayPause = useCallback(() => {
        if (!player) return

        if (player.playing()) {
            player.pause()
        } else {
            player.play()
        }
    }, [player])

    return {
        ...context,
        play: player ? player.play.bind(player) : noop,
        pause: player ? player.pause.bind(player) : noop,
        stop: player ? player.stop.bind(player) : noop,
        mute: player ? player.mute.bind(player) : noop,
        seek: player ? player.seek.bind(player) : noop,
        load,
        togglePlayPause
    }
}
