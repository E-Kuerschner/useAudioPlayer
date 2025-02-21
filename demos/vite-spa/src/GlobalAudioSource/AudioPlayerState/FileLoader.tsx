import { useState, FunctionComponent, ChangeEvent, useEffect } from "react"
import { AudioLoadOptions, useAudioPlayerContext } from "react-use-audio-player"

export const FileLoader: FunctionComponent = () => {
    const [audioFile, setAudioFile] = useState("/audio.mp3")
    const { load, isReady, error } = useAudioPlayerContext()

    useEffect(() => {
        const loadOptions: AudioLoadOptions = { initialVolume: 0.5 }
        if (audioFile.includes("stream")) {
            loadOptions.html5 = true
            loadOptions.format = "mp3"
        }

        load(audioFile, loadOptions)
    }, [audioFile, load])

    const selectAudioFile = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        if (value) {
            setAudioFile(value)
        }
    }

    return (
        <div>
            <h5>select audio file:</h5>
            <select onChange={selectAudioFile} value={audioFile}>
                <option value="/audio.mp3">audio</option>
                <option value="/cats.mp3">cats</option>
                <option value="/dog.mp3">dog</option>
                <option value="/ch_tunes - baby_seal.wav">
                    ch_tunes - baby_seal
                </option>
                <option value="/doesntExist.mp3">does not exist</option>
                <option value="https://stream.toohotradio.net/128">
                    streaming internet radio
                </option>
            </select>
            {!isReady && !error && <p>Fetching audio file...</p>}
            {error && <p className="errorMessage">Failed to load</p>}
        </div>
    )
}
