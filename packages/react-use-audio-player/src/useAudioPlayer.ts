import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import type { Howl } from "howler"

import { type Snapshot, HowlStore, defaultState } from "./HowlStore"
import type { AudioControls, AudioLoadOptions } from "./types"

export type AudioPlayer = AudioControls &
    Snapshot & {
        /** A reference to the underlying Howl object.
         * Use as an escape hatch for behavior not provided by useAudioPlayer. Please refer to Howler [documentation](https://github.com/goldfire/howler.js#documentation)
         * Manipulating the audio directly through the Howl may cause state to desynchronize
         * */
        player: Howl | null
        src: string | null
        /** A way to explicitly load an audio resource */
        load: (...args: [string, AudioLoadOptions | undefined]) => void
        /** Removes event listeners, resets state and unloads the internal Howl object */
        cleanup: () => void
    }

export function useAudioPlayer(
    src: string,
    options?: AudioLoadOptions
): Omit<AudioPlayer, "load">
export function useAudioPlayer(): AudioPlayer

/**
 * @param {string} src - The src path of the audio resource. Changing this will cause a new sound to immediately load
 * @param {AudioLoadOptions} options - Options for the loaded audio including initial properties and configuration. These can later be changed through the API.
 * @return {AudioPlayer} The audio player instance with methods for controlling playback and state.
 */
export function useAudioPlayer(src?: string, options?: AudioLoadOptions) {
    const audioRef = useRef(new HowlStore())

    // when the src param is used, load a new sound whenever the value changes
    if (src && audioRef.current && src !== audioRef.current.src) {
        audioRef.current.load({
            src,
            format: options?.format,
            html5: options?.html5,
            autoplay: options?.autoplay,
            loop: options?.loop,
            volume: options?.initialVolume,
            mute: options?.initialMute,
            rate: options?.initialRate,
            // event callbacks
            ...options
        })
    }

    // need to bind functions back to the howl since they will be called from the context of React
    const state = useSyncExternalStore(
        audioRef.current.subscribe.bind(audioRef.current),
        audioRef.current.getSnapshot.bind(audioRef.current),
        () => defaultState
    )

    useEffect(() => {
        // load the sound on mount if the src param is being used
        // this is required for StrictMode when React may remount the hook
        if (src && audioRef.current.src === null) {
            audioRef.current.load({
                src,
                format: options?.format,
                html5: options?.html5,
                autoplay: options?.autoplay,
                loop: options?.loop,
                volume: options?.initialVolume,
                mute: options?.initialMute,
                rate: options?.initialRate,
                // event callbacks
                ...options
            })
        }

        // cleans up the sound when hook unmounts
        return () => {
            if (audioRef.current) {
                audioRef.current.destroy()
            }
        }
    }, [])

    const load: AudioPlayer["load"] = useCallback((src, options) => {
        audioRef.current.load({
            src,
            format: options?.format,
            html5: options?.html5,
            autoplay: options?.autoplay,
            loop: options?.loop,
            volume: options?.initialVolume,
            mute: options?.initialMute,
            rate: options?.initialRate,
            // event callbacks
            ...options
        })
    }, [])

    return {
        ...state,
        player: audioRef.current.howl,
        src: audioRef.current.src,
        load: src ? undefined : load,
        // AudioControls interface
        play: audioRef.current.play.bind(audioRef.current),
        pause: audioRef.current.pause.bind(audioRef.current),
        togglePlayPause: audioRef.current.togglePlayPause.bind(
            audioRef.current
        ),
        stop: audioRef.current.stop.bind(audioRef.current),
        setVolume: audioRef.current.setVolume.bind(audioRef.current),
        fade: audioRef.current.fade.bind(audioRef.current),
        mute: audioRef.current.mute.bind(audioRef.current),
        unmute: audioRef.current.unmute.bind(audioRef.current),
        toggleMute: audioRef.current.toggleMute.bind(audioRef.current),
        setRate: audioRef.current.setRate.bind(audioRef.current),
        seek: audioRef.current.seek.bind(audioRef.current),
        loopOn: audioRef.current.loopOn.bind(audioRef.current),
        loopOff: audioRef.current.loopOff.bind(audioRef.current),
        toggleLoop: audioRef.current.toggleLoop.bind(audioRef.current),
        getPosition: audioRef.current.getPosition.bind(audioRef.current),
        cleanup: audioRef.current.destroy.bind(audioRef.current)
    }
}
