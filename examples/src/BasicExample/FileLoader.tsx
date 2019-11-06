import React, { ChangeEvent, FunctionComponent } from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const FileLoader: FunctionComponent<{}> = () => {
    const { playbackReady, loading, error, loadAudio } = useAudioPlayer()

    const selectAudioFile = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        if (value) {
            loadAudio(value)
        }
    }

    return (
        <div className="fileLoader">
            <h5>select audio file:</h5>
            <select onChange={selectAudioFile}>
                <option></option>
                <option>audio.mp3</option>
                <option>cats.mp3</option>
                <option>doesntExist.mp3</option>
            </select>
            {!playbackReady && !error && loading && (
                <p>Fetching audio file...</p>
            )}
            {error && <p className="errorMessage">{error.message}</p>}
        </div>
    )
}
