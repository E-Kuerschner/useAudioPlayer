import React from "react"
import { Howl } from "howler"
import { isNil } from "lodash"

interface AudioPlayer {
    loading: boolean
    loadAudio: (url: string) => void
    playbackReady: boolean
    error: Error
    play: () => void
    isPlaying: () => boolean
    pause: () => void
    stop: () => void
    seek: (pos: number) => void
    mute: (muted: boolean) => void
    sound: Howl
}

const AudioPlayerContext = React.createContext<AudioPlayer>(null)

interface AudioPlayerProviderProps {
    value?: AudioPlayer
    children: React.ReactNode
}

interface AudioPosition {
    position: number
    duration: number
}

export function AudioPlayerProvider(props: AudioPlayerProviderProps) {
    const [playbackReady, setPlaybackReady] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<Error>(null)
    const player = React.useRef<Howl>(null)

    const loadAudio = React.useCallback(
        (src: string) => {
            setError(null)

            if (playbackReady && player.current.playing()) {
                player.current.unload()
                setPlaybackReady(false)
            }

            setLoading(true)
            player.current = new Howl({
                src,
                onload() {
                    setLoading(false)
                    setPlaybackReady(true)
                },
                onloaderror(id, error) {
                    setLoading(false)
                    setPlaybackReady(false)
                    setError(new Error(error))
                }
            })
        },
        [player, playbackReady]
    )

    const play = React.useCallback(() => {
        if (!player.current.playing()) {
            player.current.play()
        }
    }, [player])

    const pause = React.useCallback(() => {
        player.current.pause()
    }, [player])

    const stop = React.useCallback(() => {
        player.current.stop()
    }, [player])

    const seek = React.useCallback(
        (pos: number) => {
            if (playbackReady) {
                player.current.seek(pos)
            }
        },
        [player, playbackReady]
    )

    const isPlaying = React.useCallback(() => {
        if (!playbackReady) return false
        return player.current.playing()
    }, [player, playbackReady])

    const mute = React.useCallback(
        (muted: boolean) => {
            if (playbackReady) {
                player.current.mute(muted)
            }
        },
        [player, playbackReady]
    )

    const contextValue: AudioPlayer = React.useMemo(() => {
        return isNil(props.value)
            ? {
                  error,
                  playbackReady,
                  loading,
                  loadAudio,
                  play,
                  pause,
                  stop,
                  seek,
                  isPlaying,
                  mute,
                  sound: player.current
              }
            : props.value
    }, [
        props.value,
        playbackReady,
        error,
        loading,
        loadAudio,
        play,
        pause,
        stop,
        seek,
        mute,
        isPlaying,
        player
    ])

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {props.children}
        </AudioPlayerContext.Provider>
    )
}

// gives programmer access to the audio context
export const useAudioPlayer = (url?: string): AudioPlayer => {
    const value = React.useContext(AudioPlayerContext)

    React.useEffect(() => {
        if (url) {
            value.loadAudio(url)
        }
    }, [url, value])

    return value
}

// gives current audio position state updates in an animation frame loop for animating visualizations
export const useAudioPosition = (): AudioPosition => {
    const { sound, playbackReady } = useAudioPlayer()
    const [position, setPosition] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const frameRequest = React.useRef<number | undefined>()

    const animate = React.useCallback(() => {
        if (playbackReady && sound.playing()) {
            setPosition(sound.seek() as number)
            frameRequest.current = requestAnimationFrame(animate)
        } else {
            cancelAnimationFrame(frameRequest.current)
        }
    }, [playbackReady, sound])

    React.useEffect(() => {
        if (playbackReady) {
            sound.on("play", () => {
                setDuration(sound.duration())
                frameRequest.current = requestAnimationFrame(animate)
            })
            sound.on("pause", () => {
                cancelAnimationFrame(frameRequest.current)
            })
            sound.on("stop", () => {
                setPosition(0)
                cancelAnimationFrame(frameRequest.current)
            })
            return () => {
                sound.off("play")
                sound.off("pause")
                sound.off("stop")
            }
        }
    }, [playbackReady, sound, animate])

    return {
        position,
        duration
    }
}
