import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import type { Howl } from "howler"
import { type Snapshot, HowlStore } from "./HowlStore"
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
    options: AudioLoadOptions
): AudioPlayer
export function useAudioPlayer(): AudioPlayer

/**
 * @param {string} src - The src path of the audio resource. Changing this will cause a new sound to immediately load
 * @param {AudioLoadOptions} options - Options for the loaded audio including initial properties and configruation. These can later be changed through the API.
 * @return {AudioPlayer} The audio player instance with methods for controlling playback and state.
 */
export function useAudioPlayer(
    src?: string,
    options?: AudioLoadOptions
): AudioPlayer {
    const audioRef = useRef<HowlStore>()
    // signal used to forcefully recreate the store after a imperative unload
    const hasStaleRef = useRef(false)

    function getAudio() {
        if (!audioRef.current || hasStaleRef.current) {
            if (!src) {
                audioRef.current = new HowlStore()
            } else {
                audioRef.current = new HowlStore({
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

            hasStaleRef.current = false
        }

        return audioRef.current
    }

    // destroy and unset the current sound if the src option changes
    // subsequent calls to getAudio() will create the audio instance with the new src and options
    if (src && audioRef.current && src !== audioRef.current.src) {
        audioRef.current!.destroy()
        hasStaleRef.current = true
    }

    // lazily create/get the HowlStore for use below
    const audio = getAudio()

    // need to bind functions back to the howl since they will be called from the context of React
    const state = useSyncExternalStore(
        audio.subscribe.bind(audio),
        audio.getSnapshot.bind(audio)
    )

    useEffect(() => {
        // cleans up the sound when hook unmounts
        return () => {
            if (audioRef.current) {
                audioRef.current.destroy()
                hasStaleRef.current = true
            }
        }
    }, [])

    const load: AudioPlayer["load"] = useCallback(
        (src, options) => {
            hasStaleRef.current = false
            audio.load({
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
        },
        [audio]
    )

    return {
        ...state,
        player: audio.howl,
        src: audio.src,
        load,
        // AudioControls interface
        play: audio.play.bind(audio),
        pause: audio.pause.bind(audio),
        togglePlayPause: audio.togglePlayPause.bind(audio),
        stop: audio.stop.bind(audio),
        setVolume: audio.setVolume.bind(audio),
        fade: audio.fade.bind(audio),
        mute: audio.mute.bind(audio),
        unmute: audio.unmute.bind(audio),
        toggleMute: audio.toggleMute.bind(audio),
        setRate: audio.setRate.bind(audio),
        seek: audio.seek.bind(audio),
        loopOn: audio.loopOn.bind(audio),
        loopOff: audio.loopOff.bind(audio),
        toggleLoop: audio.toggleLoop.bind(audio),
        getPosition: audio.getPosition.bind(audio),
        cleanup: audio.destroy.bind(audio)
    }
}
