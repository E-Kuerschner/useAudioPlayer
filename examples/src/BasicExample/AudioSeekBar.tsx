import React, { FunctionComponent, MouseEvent } from "react"
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player"

export const AudioSeekBar: FunctionComponent<{}> = () => {
    const { position, duration } = useAudioPosition()
    const { seek, playing } = useAudioPlayer()
    const [barWidth, setBarWidth] = React.useState("0%")

    const seekBarElem = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const width = ((position / duration) * 100 || 0) + "%"
        setBarWidth(width)
    }, [position, duration])

    const goTo = React.useCallback(
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
        [duration, seekBarElem]
    )

    return (
        <div className="audioSeekBar" ref={seekBarElem} onClick={goTo}>
            <div style={{ width: barWidth }} className="audioSeekBar__tick" />
        </div>
    )
}
