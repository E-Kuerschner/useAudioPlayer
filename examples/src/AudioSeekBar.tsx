import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    FunctionComponent,
    MouseEvent
} from "react"
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player"
import "./AudioSeekBar.css"

interface AudioSeekBarProps {
    className?: string
}

export const AudioSeekBar: FunctionComponent<AudioSeekBarProps> = props => {
    const { className = "" } = props
    const { position, duration } = useAudioPosition({ highRefreshRate: true })
    const { seek, playing } = useAudioPlayer()
    const [barWidth, setBarWidth] = useState("0%")

    const seekBarElem = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const width = ((position / duration) * 100 || 0) + "%"
        setBarWidth(width)
    }, [position, duration])

    const goTo = useCallback(
        (event: MouseEvent) => {
            const { pageX: eventOffsetX } = event

            // TODO duration is 0 until the audio starts playing
            if (seekBarElem.current && playing) {
                const elementOffsetX = seekBarElem.current.offsetLeft
                const elementWidth = seekBarElem.current.clientWidth
                const percent = (eventOffsetX - elementOffsetX) / elementWidth
                seek(percent * duration)
            }
        },
        [duration, playing, seek]
    )

    return (
        <div
            className={`audioSeekBar ${className} `}
            ref={seekBarElem}
            onClick={goTo}
        >
            <div style={{ width: barWidth }} className="audioSeekBar__tick" />
        </div>
    )
}
