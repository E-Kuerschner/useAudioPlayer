import React, { FunctionComponent } from "react"
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player"
import { AudioSeekBar } from "./AudioSeekBar"
import { FileLoader } from "./FileLoader"
import { AudioControls } from "./AudioControls"
import { BackToHome } from "../BackToHome"
import "./styles.css"

export const BasicExample: FunctionComponent<{}> = () => {
    return (
        <AudioPlayerProvider>
            <BackToHome />
            <Player />
        </AudioPlayerProvider>
    )
}

const Player: FunctionComponent<{}> = () => {
    const value = useAudioPlayer()
    const { playbackReady } = value

    return (
        <div className="basicExample">
            <FileLoader />
            <br />
            {playbackReady && (
                <React.Fragment>
                    <AudioControls />
                    <AudioSeekBar />
                </React.Fragment>
            )}
        </div>
    )
}
