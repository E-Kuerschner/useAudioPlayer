import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useContext,
    useReducer,
    useMemo
} from "react"
import { Howl } from "howler"
import { initialState, reducer, Actions } from "./audioPlayerState"

const noop = () => {}

interface AudioSrcProps {
    src: string
    format?: string
    autoplay?: boolean
}

interface AudioPlayer {
    player: Howl | null
    load: (args: AudioSrcProps) => void
    error: Error | null
    loading: boolean
    playing: boolean
    stopped: boolean
    ready: boolean
}

type UseAudioPlayer = Omit<AudioPlayer, "player"> & {
    play: Howl["play"] | typeof noop
    pause: Howl["pause"] | typeof noop
    stop: Howl["stop"] | typeof noop
    mute: Howl["mute"] | typeof noop
    seek: Howl["seek"] | typeof noop
}

const AudioPlayerContext = React.createContext<AudioPlayer | null>(null)

interface AudioPlayerProviderProps {
    children: React.ReactNode
    value?: AudioPlayer
}

interface AudioPosition {
    position: number
    duration: number
}

export function AudioPlayerProvider({
    children,
    value
}: AudioPlayerProviderProps) {
    const [player, setPlayer] = useState<Howl | null>(null)
    const [{ loading, error, playing, stopped }, dispatch] = useReducer(
        reducer,
        initialState
    )

    const playerRef = useRef<Howl>()

    const constructHowl = useCallback(
        ({ src, format, autoplay }: AudioSrcProps): Howl => {
            return new Howl({
                src,
                format,
                autoplay
            })
        },
        []
    )

    const load = useCallback(
        ({ src, format, autoplay = false }: AudioSrcProps) => {
            dispatch({ type: Actions.RESET_ERRORS })

            let wasPlaying = false
            if (playerRef.current) {
                // don't do anything if we're asked to reload the same source
                // @ts-ignore the _src argument actually exists
                if (playerRef.current._src === src) return
                wasPlaying = playerRef.current.playing()
                if (wasPlaying) {
                    playerRef.current.stop()
                    // remove event handlers from player that is about to be replaced
                    playerRef.current.off()
                    playerRef.current = undefined
                }
            }

            // create a new player
            const howl = constructHowl({
                src,
                format,
                autoplay: wasPlaying || autoplay // continues playing next song
            })

            // if this howl has already been loaded then there is no need to change loading state
            // @ts-ignore _state exists
            if (howl._state !== "loaded") {
                dispatch({ type: Actions.ON_LOAD })
            }

            howl.on("load", () => void dispatch({ type: Actions.ON_LOAD }))
            howl.on("play", function(this: Howl) {
                // prevents howl from playing the same song twice
                if (!this.playing()) return
                dispatch({ type: Actions.ON_PLAY })
            })
            howl.on("end", () => void dispatch({ type: Actions.ON_END }))
            howl.on("pause", () => void dispatch({ type: Actions.ON_PAUSE }))
            howl.on("stop", () => void dispatch({ type: Actions.ON_STOP }))
            howl.on("playerror", (_id, error) => {
                dispatch({
                    type: Actions.ON_PLAY_ERROR,
                    error: new Error("[Play error] " + error)
                })
            })
            howl.on("loaderror", (_id, error) => {
                dispatch({
                    type: Actions.ON_LOAD_ERROR,
                    error: new Error("[Load error] " + error)
                })
            })

            setPlayer(howl)
            playerRef.current = howl
        },
        [constructHowl]
    )

    useEffect(() => {
        // unload the player on unmount
        return () => {
            if (playerRef.current) playerRef.current.unload()
        }
    }, [])

    const contextValue: AudioPlayer = useMemo(() => {
        return value
            ? value
            : {
                  player,
                  load,
                  error,
                  loading,
                  playing,
                  stopped,
                  ready: !loading && !error
              }
    }, [loading, error, playing, stopped, load, value, player])

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
        </AudioPlayerContext.Provider>
    )
}

export const useAudioPlayer = (props?: AudioSrcProps): UseAudioPlayer => {
    const { player, load, ...context } = useContext(AudioPlayerContext)!

    const { src, format, autoplay } = props || {}

    useEffect(() => {
        // if useAudioPlayer is called without arguments
        // don't do anything: the user will have access
        // to the current context
        if (!src) return
        load({ src, format, autoplay })
    }, [src, format, autoplay, load])

    return {
        ...context,
        play: player ? player.play.bind(player) : noop,
        pause: player ? player.pause.bind(player) : noop,
        stop: player ? player.stop.bind(player) : noop,
        mute: player ? player.mute.bind(player) : noop,
        seek: player ? player.seek.bind(player) : noop,
        load
    }
}

interface UseAudioPositionConfig {
    highRefreshRate?: boolean
}

// gives current audio position state - updates in an animation frame loop for animating audio visualizations
export const useAudioPosition = (
    config: UseAudioPositionConfig = {}
): AudioPosition => {
    const { highRefreshRate = false } = config
    const { player, playing, stopped } = useContext(AudioPlayerContext)!
    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)

    // sets position and duration on player initialization and when the audio is stopped
    useEffect(() => {
        if (player) {
            setPosition(player.seek() as number)
            setDuration(player.duration() as number)
        }
    }, [player, stopped])

    // updates position on a one second loop for low refresh rate default setting
    useEffect(() => {
        let timeout: number
        if (!highRefreshRate && player && playing)
            timeout = window.setInterval(
                () => setPosition(player.seek() as number),
                1000
            )
        return () => clearTimeout(timeout)
    }, [highRefreshRate, player, playing])

    // updates position on a 60fps loop for high refresh rate setting
    useEffect(() => {
        let frame: number
        const animate = () => {
            setPosition(player?.seek() as number)
            frame = requestAnimationFrame(animate)
        }

        if (highRefreshRate && player && playing) {
            animate()
        }

        return () => {
            if (frame) {
                cancelAnimationFrame(frame)
            }
        }
    }, [highRefreshRate, player, playing])

    return { position, duration }
}
