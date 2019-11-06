import React, { FunctionComponent } from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const AudioControls: FunctionComponent<{}> = () => {
    const { play, pause, stop, mute, isPlaying } = useAudioPlayer()
    // TODO useAudioPlayer should track playing state rather than an isPlaying function
    const [playing, setPlaying] = React.useState(isPlaying())
    const [muted, setMuted] = React.useState(false)

    React.useEffect(() => {
        mute(muted)
    }, [muted, mute])

    const handlePlayPause = () => {
        if (isPlaying()) {
            setPlaying(false)
            pause()
        } else {
            setPlaying(true)
            play()
        }
    }

    const handleStop = () => {
        setPlaying(false)
        stop()
    }

    return (
        <div className="audioControls">
            <button onClick={handlePlayPause}>
                {playing ? "pause" : "play"}
            </button>
            <button onClick={handleStop}>stop</button>
            <button onClick={() => setMuted(lastState => !lastState)}>
                mute
            </button>
        </div>
    )
}
