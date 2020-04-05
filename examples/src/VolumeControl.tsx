import React, { ChangeEvent, useCallback } from "react"
import { useAudioPlayer } from "react-use-audio-player"
import "./VolumeControl.scss"

export const VolumeControl = () => {
    const { volume } = useAudioPlayer()

    const handleChange = useCallback(
        (slider: ChangeEvent<HTMLInputElement>) => {
            const volValue = parseFloat(
                (Number(slider.target.value) / 100).toFixed(2)
            )
            return volume(volValue)
        },
        [volume]
    )

    return (
        <div className="volumeControl">
            <input
                type="range"
                min={0}
                max={100}
                onChange={handleChange}
                defaultValue={100}
            />
            <i className="fa fa-volume-up volumeControl__icon" />
        </div>
    )
}
