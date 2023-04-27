import React from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"

export const Spotifyish = () => {
    const sounds = ["/cats.mp3", "/dog.mp3"]
    const { load, playing } = useGlobalAudioPlayer()
    return (
        <div className="soundLibrary page">
            <div className="page__title">Sound Library</div>
            <div className="soundLibrary__sounds">
                {sounds.map((src, i) => {
                    return (
                        <div
                            key={i}
                            className="track"
                            onClick={() => load(src)}
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
