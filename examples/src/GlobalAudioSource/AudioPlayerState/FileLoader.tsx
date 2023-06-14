import React, {
    useState,
    FunctionComponent,
    ChangeEvent,
    useEffect
} from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"

export const FileLoader: FunctionComponent = () => {
    const [audioFile, setAudioFile] = useState("/audio.mp3")
    const { load, isReady, error } = useGlobalAudioPlayer()

    useEffect(() => {
        load(audioFile, { html5: true })
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
                <option value="/dogs.mp3">dog</option>
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
