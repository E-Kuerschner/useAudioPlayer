import * as React from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const AudioControls: React.FunctionComponent<{}> = () => {
    const { play, pause, stop, mute, playing } = useAudioPlayer()
    const [muted, setMuted] = React.useState(false)

    React.useEffect(() => {
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
