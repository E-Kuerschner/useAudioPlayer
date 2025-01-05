import { FunctionComponent } from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"
import { FileLoader } from "./FileLoader"
import { AudioControls } from "./AudioControls"
import { AudioSeekBar } from "../../AudioSeekBar"
import { TimeLabel } from "../../TimeLabel"
import "./styles.scss"

const Player = () => {
    const state = useGlobalAudioPlayer()
    if (state.isReady) {
        return (
            <div className="player">
                <AudioControls />
                <AudioSeekBar className="player__seek" />
                <TimeLabel />
                <br />
                <p>
                    Below are all the fields available on the result of
                    useGlobalAudioPlayer/useAudioPlayer which can be used to
                    help build user interfaces for your sounds
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

export const BasicExample: FunctionComponent = () => {
    return (
        <div className="basicExample">
            <FileLoader />
            <br />
            <Player />
        </div>
    )
}
