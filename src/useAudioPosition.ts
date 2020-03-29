import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { AudioPlayerContext } from "./context"
import { useAudioPlayer, AudioPlayerControls } from "./useAudioPlayer"

interface UseAudioPositionConfig {
    highRefreshRate?: boolean
}

interface AudioPosition {
    position: number
    duration: number
    seek: AudioPlayerControls["seek"]
}

// gives current audio position state - updates in an animation frame loop for animating audio visualizations
export const useAudioPosition = (
    config: UseAudioPositionConfig = {}
): AudioPosition => {
    const { highRefreshRate = false } = config
    const { player, playing, stopped } = useContext(AudioPlayerContext)!
    const { seek } = useAudioPlayer()
    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)
    const animationFrameRef = useRef<number>()

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
    useLayoutEffect(() => {
        const animate = () => {
            setPosition(player?.seek() as number)
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        // kick off a new animation cycle when the player is defined and starts playing
        if (highRefreshRate && player && playing) {
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [highRefreshRate, player, playing])

    return { position, duration, seek }
}
