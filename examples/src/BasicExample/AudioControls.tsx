import React, { useEffect, useState, FunctionComponent } from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const AudioControls: FunctionComponent<{}> = () => {
    const { play, pause, stop, mute, playing } = useAudioPlayer()
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        mute(muted)
    }, [muted, mute])

    return (
        <div className="audioControls">
            <button onClick={() => (playing ? pause() : play())}>
                {playing ? "pause" : "play"}
            </button>
            <button onClick={() => stop()}>stop</button>
            <button onClick={() => setMuted(lastState => !lastState)}>
                mute
            </button>
        </div>
    )
}
