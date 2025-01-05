import React from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"
import "./styles.scss"

export const Spotifyish = () => {
    const sounds = [
        "/audio.mp3",
        "/cats.mp3",
        "/dog.mp3",
        "/ch_tunes - baby_seal.wav",
        "/ch_tunes - jam_2.wav",
        "/ch_tunes - jam_4.wav",
        "/ch_tunes - jam_8.wav",
        "/ch_tunes - jam_10.wav"
    ]
    const { load, src: loadedSrc } = useGlobalAudioPlayer()
    return (
        <div className="soundLibrary page">
            <div className="page__title">Sound Library</div>
            <p>
                This page lists the full set of sounds available in the demos.
            </p>
            <div className="soundLibrary__sounds">
                {sounds.map((src, i) => {
                    return (
                        <div
                            key={i}
                            className={`track ${
                                src === loadedSrc ? "track--playing" : ""
                            }`}
                            onClick={() => load(src, { autoplay: true })}
                        >
                            <i className="fa fa-music track__icon" />
                            <div className="track__title">
                                {src.slice(1, src.indexOf("."))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
