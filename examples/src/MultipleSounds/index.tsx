import React, { useState, useCallback, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAudioPlayer } from "react-use-audio-player"
import "./styles.scss"

export const MultipleSounds = () => {
    const [xFadeValue, setXFadeValue] = useState(50)
    const song1 = useAudioPlayer()
    const song2 = useAudioPlayer()

    useEffect(() => {
        song1.load("/ch_tunes - jam_4.wav", { autoplay: false })
        song2.load("/ch_tunes - baby_seal.wav", { autoplay: false })
    }, [])

    const togglePlayingBoth = useCallback(() => {
        song1.togglePlayPause()
        song2.togglePlayPause()
    }, [song1.togglePlayPause, song2.togglePlayPause])

    const handleFade = useCallback(e => {
        setXFadeValue(e.target.value)
        const ratio = e.target.value / 100
        song1.setVolume(1 - ratio)
        song2.setVolume(ratio)
    }, [])

    return (
        <div className="page multipleSounds">
            <Link to="..">go back</Link>
            <div className="multipleSounds__tracks">
                <div className="multipleSounds__track">
                    <p>Song A</p>
                    <p>Volume {song1.volume.toFixed(2)}</p>
                </div>

                <div className="multipleSounds__track">
                    <p>Song B</p>
                    <p>Volume {song2.volume.toFixed(2)}</p>
                </div>
            </div>
            <div className="multipleSounds__controls">
                <button onClick={togglePlayingBoth}>Start</button>
                <input type="range" value={xFadeValue} onChange={handleFade} />
            </div>
        </div>
    )
}
