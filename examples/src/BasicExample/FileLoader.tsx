import React, { useState, FunctionComponent, ChangeEvent } from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const FileLoader: FunctionComponent<{}> = () => {
    const [audioFile, setAudioFile] = useState("audio.mp3")
    const { ready, loading, error } = useAudioPlayer({ src: audioFile })

    const selectAudioFile = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        if (value) {
            setAudioFile(value)
        }
    }

    return (
        <div className="fileLoader">
            <h5>select audio file:</h5>
            <select onChange={selectAudioFile} defaultValue="audio.mp3">
                <option></option>
                <option>audio.mp3</option>
                <option>cats.mp3</option>
                <option>explosion.wav</option>
                <option>doesntExist.mp3</option>
            </select>
            {!ready && !error && loading && <p>Fetching audio file...</p>}
            {error && <p className="errorMessage">{error.message}</p>}
        </div>
    )
}
