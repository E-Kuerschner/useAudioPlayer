import { useCallback, useEffect, useReducer, useRef } from "react"
import {
    Action,
    ActionTypes,
    initStateFromHowl,
    reducer as audioStateReducer
} from "./audioPlayerState"
import { useHowlEventSync } from "./useHowlEventSync"
import { HowlInstanceManagerSingleton } from "./HowlInstanceManager"
import { AudioPlayer, LoadArguments } from "./types"

export function useGlobalAudioPlayer(): AudioPlayer {
    const howlManager = useRef(HowlInstanceManagerSingleton.getInstance())

    const [state, dispatch] = useHowlEventSync(
        howlManager.current,
        useReducer(
            audioStateReducer,
            howlManager.current.getHowl(),
            initStateFromHowl
        )
    )

    useEffect(() => {
        const howlOnMount = howlManager.current.getHowl()
        if (howlOnMount !== undefined) {
            dispatch({ type: ActionTypes.START_LOAD, howl: howlOnMount })
            if (howlOnMount.state() === "loaded") {
                dispatch({ type: ActionTypes.ON_LOAD, howl: howlOnMount })
            }
        }

        function sync(action: Action) {
            dispatch(action)
        }

        const subscriptionId = howlManager.current.subscribe(sync)

        return () => {
            howlManager.current.unsubscribe(subscriptionId)
        }
    }, [])

    const load = useCallback((...[src, options = {}]: LoadArguments) => {
        howlManager.current.createHowl({
            src,
            ...options
        })
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

        howlManager.current.broadcast({
            type: ActionTypes.ON_LOOP,
            howl,
            toggleValue: loopOnOff
        })
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
