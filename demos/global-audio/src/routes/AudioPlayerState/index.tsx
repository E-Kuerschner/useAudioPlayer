import { FunctionComponent } from "react"
import { useAudioPlayerContext } from "react-use-audio-player"
import { Link } from "react-router-dom"
import { FileLoader } from "./FileLoader"
import "./styles.scss"

const State = () => {
    const state = useAudioPlayerContext()
    if (state.isReady) {
        return (
            <div className="player">
                <p>
                    Below are all the fields available on the result of
                    useAudioPlayer which can be used to help build user
                    interfaces for your sounds
                </p>
                <h3>Audio state:</h3>
                <table>
                    <tbody>
                        {Object.entries(state).map(([k, v]) => {
                            if (typeof v === "function") return null

                            return (
                                <tr key={k}>
                                    <td>{k}</td>
                                    <td>{v?.toString() ?? "--"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return null
}

export const AudioPlayerState: FunctionComponent = () => {
    return (
        <div className="basicExample">
            <Link to=".." style={{ marginBottom: 16 }}>
                Go back
            </Link>
            <FileLoader />
            <br />
            <State />
        </div>
    )
}
