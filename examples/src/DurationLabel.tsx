import { useAudioPlayer } from "react-use-audio-player"
import React, { useMemo } from "react"

export const DurationLabel = () => {
    const { duration } = useAudioPlayer()

    const durationLabel = useMemo(() => {
        const display = time => `${time ? `${time}:` : ""}`
        const hours = Math.floor(duration / 60 / 60)
        const minutes = Math.floor(duration / 60) % 60
        const seconds = Math.floor(duration - minutes * 60)
        return `${display(hours)}${display(minutes)}${seconds}`
    }, [duration])

    return <div>{durationLabel}</div>
}
