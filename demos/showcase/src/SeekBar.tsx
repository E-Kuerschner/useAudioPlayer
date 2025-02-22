import { Slider } from "@/components/ui/slider.tsx"
import { useEffect, useRef, useState } from "react"

type Props = {
    duration: number
    getPosition: () => number
    onSeek: (time: number) => void
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function SeekBar({ duration, getPosition, onSeek }: Props) {
    const frameRef = useRef<number>()
    const [pos, setPos] = useState(0)
    useEffect(() => {
        const animate = () => {
            setPos(getPosition())
            frameRef.current = requestAnimationFrame(animate)
        }

        frameRef.current = window.requestAnimationFrame(animate)

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
        }
    }, [getPosition])

    const handleSeek = (value: number[]) => {
        onSeek(value[0])
    }

    return (
        <div className="flex items-center space-x-2">
            <span>{formatTime(pos)}</span>
            <Slider
                max={duration}
                value={[pos]}
                onValueChange={handleSeek}
                className="flex-grow cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
        </div>
    )
}
