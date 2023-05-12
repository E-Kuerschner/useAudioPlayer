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
                    <p>{song1.src}</p>
                    <div className="hstack">
                        <label htmlFor="song1vol">volume</label>
                        <input
                            name="song1vol"
                            type="range"
                            readOnly
                            value={Number(song1.volume.toFixed(2)) * 100}
                        />
                    </div>
                </div>

                <div className="multipleSounds__track">
                    <p>{song2.src}</p>
                    <div className="hstack">
                        <label htmlFor="song2vol">volume</label>
                        <input
                            name="song2vol"
                            type="range"
                            readOnly
                            value={Number(song2.volume.toFixed(2)) * 100}
                        />
                    </div>
                </div>
            </div>
            <div className="multipleSounds__controls">
                <button onClick={togglePlayingBoth}>
                    {song1.playing ? "Pause" : "Play"}
                </button>
                <input type="range" value={xFadeValue} onChange={handleFade} />
                <p>Adjust the slider to fade between the two songs</p>
            </div>
        </div>
    )
}
