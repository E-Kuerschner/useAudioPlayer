import {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef
} from "react"
import { playerContext, positionContext } from "./context"
import { Howl } from "howler"

interface UseAudioPositionConfig {
    highRefreshRate?: boolean
}

interface AudioPosition {
    position: number
    duration: number
    seek: (position: number) => number
}

// gives current audio position state - updates in an animation frame loop for animating audio visualizations
export const useAudioPosition = (
    config: UseAudioPositionConfig = {}
): AudioPosition => {
    const { highRefreshRate = false } = config
    const { player, playing, stopped, duration } = useContext(playerContext)!
    const { position, setPosition } = useContext(positionContext)

    const animationFrameRef = useRef<number>()

    // sets position on player initialization and when the audio is stopped
    useEffect(() => {
        if (player) {
            setPosition(player.seek() as number)
        }
    }, [player, setPosition, stopped])

    // updates position on a one second loop for low refresh rate default setting
    useEffect(() => {
        let timeout: number
        if (!highRefreshRate && player && playing)
            timeout = window.setInterval(
                () => setPosition(player.seek() as number),
                1000
            )
        return () => clearTimeout(timeout)
    }, [highRefreshRate, player, playing, setPosition])

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
    }, [highRefreshRate, player, playing, setPosition])

    const seek = useCallback(
        position => {
            if (!player) return 0

            // it appears that howler returns the Howl object when seek is given a position
            // to get the latest potion you must call seek again with no parameters
            const result = player.seek(position) as Howl
            const updatedPos = result.seek() as number
            setPosition(updatedPos)
            return updatedPos
        },
        [player, setPosition]
    )

    return { position, duration, seek }
}
