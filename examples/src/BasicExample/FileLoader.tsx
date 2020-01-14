import * as React from "react"
import { useAudioPlayer } from "react-use-audio-player"

export const FileLoader: React.FunctionComponent<{}> = () => {
    const [audioFile, setAudioFile] = React.useState("audio.mp3")
    const { ready, loading, error } = useAudioPlayer({ src: audioFile })

    const selectAudioFile = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        if (value) {
            setAudioFile(value)
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
            {!ready && !error && loading && <p>Fetching audio file...</p>}
            {error && <p className="errorMessage">{error.message}</p>}
        </div>
    )
}
