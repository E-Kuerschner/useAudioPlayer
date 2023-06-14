import { useCallback, useEffect, useReducer, useRef } from "react"
import {
    initStateFromHowl,
    reducer as audioStateReducer
} from "./audioPlayerState"
import { useHowlEventSync } from "./useHowlEventSync"
import { HowlInstanceManager } from "./HowlInstanceManager"
import { AudioPlayer, LoadArguments } from "./types"

export const useAudioPlayer = (): AudioPlayer => {
    const howlManager = useRef(new HowlInstanceManager())
    const [state, dispatch] = useHowlEventSync(
        howlManager.current,
        useReducer(
            audioStateReducer,
            howlManager.current.getHowl(),
            initStateFromHowl
        )
    )

    useEffect(() => {
        // stop/delete the sound object when the hook unmounts
        return () => {
            howlManager.current.destroyHowl()
        }
    }, [])

    const load = useCallback((...[src, options = {}]: LoadArguments) => {
        const howl = howlManager.current.createHowl({
            src,
            ...options
        })

        dispatch({ type: "START_LOAD", howl })
    }, [])

    const seek = useCallback((seconds: number) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.seek(seconds)
    }, [])

    const getPosition = useCallback(() => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return 0
        }

        return howl.seek() ?? 0
    }, [])

    const play = useCallback(() => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.play()
    }, [])

    const pause = useCallback(() => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.pause()
    }, [])

    const togglePlayPause = useCallback(() => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        if (state.playing) {
            howl.pause()
        } else {
            howl.play()
        }
    }, [state])

    const stop = useCallback(() => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.stop()
    }, [])

    const fade = useCallback((from: number, to: number, duration: number) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.fade(from, to, duration)
    }, [])

    const setRate = useCallback((speed: number) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.rate(speed)
    }, [])

    const setVolume = useCallback((vol: number) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.volume(vol)
    }, [])

    const mute = useCallback((muteOnOff: boolean) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        howl.mute(muteOnOff)
    }, [])

    const loop = useCallback((loopOnOff: boolean) => {
        const howl = howlManager.current.getHowl()
        if (howl === undefined) {
            return
        }

        // this differs from the implementation in useGlobalAudioPlayer which needs to broadcast the action to itself and all other instances of the hook
        // maybe these two behaviors could be abstracted with one interface in the future
        dispatch({ type: "ON_LOOP", howl, toggleValue: loopOnOff })
    }, [])

    return {
        ...state,
        load,
        seek,
        getPosition,
        play,
        pause,
        togglePlayPause,
        stop,
        mute,
        fade,
        setRate,
        setVolume,
        loop
    }
}
