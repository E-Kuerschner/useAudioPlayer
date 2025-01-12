import { useAudioPlayerContext } from "react-use-audio-player"
import { Play, Pause } from "lucide-react"
import { AudioSeekBar } from "./AudioSeekBar.tsx"
import { TimeLabel } from "./TimeLabel.tsx"
import { VolumeControl } from "./VolumeControl.tsx"

export const PlayBar = () => {
    const { togglePlayPause, isPlaying, isReady, setRate, rate, src } =
        useAudioPlayerContext()

    return (
        <div className="playBar">
            <div className="playBar__track">Track: {src}</div>
            <div className="playBar__mainControls">
                <button
                    className="playBar__playButton"
                    onClick={togglePlayPause}
                    disabled={!isReady}
                >
                    {isPlaying ? (
                        <Pause id="playButton" className="playBar__icon" />
                    ) : (
                        <Play id="pauseButton" className="playBar__icon" />
                    )}
                </button>
                <div className="playBar__timeStuff">
                    <AudioSeekBar className="playBar__seek" />
                    <TimeLabel />
                </div>
            </div>
            <div>
                <div className="playBar__rateControl">
                    <span>Playback Speed:</span>
                    <select
                        className="playBar__rateSelect"
                        name="rateSelect"
                        id="rate"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                    >
                        <option value="0.5">1/2x</option>
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                    </select>
                </div>
                <VolumeControl />
            </div>
        </div>
    )
}
