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
            {!playbackReady && !error && loading && <h1>NOT READY</h1>}
            {error && <h1>{error.message}</h1>}
            <h5>select audio file:</h5>
            <select onChange={selectAudioFile}>
                <option></option>
                <option>audio.mp3</option>
                <option>cats.mp3</option>
                <option>doesntExist.mp3</option>
            </select>
        </div>
    )
}
