import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useContext,
} from "react"
import { Howl } from "howler"

const noop = () => {}

interface UseAudioPlayerProps {
    src: string
    format: string
    autoplay: boolean
}

interface AudioPlayer {
    player: Howl | null
    load: (args: UseAudioPlayerProps) => void
    error: Error | null
    loading: boolean
    playing: boolean
    stopped: boolean
    ready: boolean
}

type UseAudioPlayer = Omit<AudioPlayer, "player" | "load"> & {
    play: Howl["play"] | typeof noop
    pause: Howl["pause"] | typeof noop
    stop: Howl["stop"] | typeof noop
    mute: Howl["mute"] | typeof noop
    seek: Howl["seek"] | typeof noop
}

const AudioPlayerContext = React.createContext<AudioPlayer | null>(null)

interface AudioPlayerProviderProps {
    children: React.ReactNode
}

interface AudioPosition {
    position: number
    duration: number
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
    const [player, setPlayer] = useState<Howl | null>(null)
    const playerRef = useRef<Howl>()
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(true)
    const [playing, setPlaying] = useState(false)
    const [stopped, setStopped] = useState(true)

    const load = useCallback(({ src, format, autoplay }) => {
        let wasPlaying = false
        if (playerRef.current) {
            // don't do anything if we're asked to reload the same source
            // @ts-ignore the _src argument actually exists
            if (playerRef.current._src === src) return
            wasPlaying = playerRef.current.playing()
            // destroys the previous player
            playerRef.current.unload()
        }

        // create a new player
        const howl = new Howl({
            src,
            format,
            autoplay: wasPlaying || autoplay, // continues playing next song
            onload: () => void setLoading(false),
            onplay: () => {
                // prevents howl from playing the same song twice
                if (!howl.playing()) return
                setPlaying(true)
                setStopped(false)
            },
            onpause: () => void setPlaying(false),
            onstop: () => void setStopped(true),
            onplayerror: (_id, error) => {
                setError(new Error("[Play error] " + error))
                setPlaying(false)
                setStopped(true)
            },
            onloaderror: (_id, error) => {
                setError(new Error("[Load error] " + error))
                setLoading(false)
            },
        })

        setPlayer(howl)
        playerRef.current = howl
    }, [])

    useEffect(() => {
        // unload the player on unmount
        return () => {
            if (playerRef.current) playerRef.current.unload()
        }
    }, [])

    const contextValue: AudioPlayer = {
        player,
        load,
        error,
        loading,
        playing,
        stopped,
        ready: !loading && !error,
    }

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
        </AudioPlayerContext.Provider>
    )
}

export const useAudioPlayer = (props: UseAudioPlayerProps): UseAudioPlayer => {
    const { player, load, ...context } = useContext(AudioPlayerContext)!

    const { src, format = "mp3", autoplay } = props || {}

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
    }
}

// gives current audio position state updates in an animation frame loop for animating visualizations
export const useAudioPosition = (): AudioPosition => {
    const { player, stopped, playing } = useContext(AudioPlayerContext)!

    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)

    // sets position and duration on mount
    useEffect(() => {
        if (player) {
            setPosition(player.seek() as number)
            setDuration(player.duration() as number)
        }
    }, [player, stopped])

    // updates position
    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (player && playing)
            timeout = setInterval(
                () => setPosition(player.seek() as number),
                1000
            )
        return () => clearTimeout(timeout)
    }, [player, playing])

    return { position, duration }
}
