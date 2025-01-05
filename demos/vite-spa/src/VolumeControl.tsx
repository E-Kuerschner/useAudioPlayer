import { ChangeEvent, useCallback } from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"
import "./VolumeControl.scss"

export const VolumeControl = () => {
    const { setVolume, volume } = useGlobalAudioPlayer()

    const handleChange = useCallback(
        (slider: ChangeEvent<HTMLInputElement>) => {
            const volValue = parseFloat(
                (Number(slider.target.value) / 100).toFixed(2)
            )
            return setVolume(volValue)
        },
        [setVolume]
    )

    return (
        <div className="volumeControl">
            <input
                type="range"
                min={0}
                max={100}
                onChange={handleChange}
                value={volume * 100}
            />
            <i className="fa fa-volume-up volumeControl__icon" />
        </div>
    )
}
