import { useAudioPlayerContext } from "react-use-audio-player"
import { Link } from "react-router-dom"
import { Music2 } from "lucide-react"
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
    const { load, src: loadedSrc } = useAudioPlayerContext()
    return (
        <div className="soundLibrary page">
            <Link to=".." style={{ marginBottom: 16 }}>
                Go back
            </Link>
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
                            <Music2 className="track__icon" />
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
