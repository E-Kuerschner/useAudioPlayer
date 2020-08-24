import React, { FunctionComponent } from "react"
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player"
import { FileLoader } from "./FileLoader"
import { AudioSeekBar } from "../AudioSeekBar"
import { BackToHome } from "../BackToHome"
import { AudioControls } from "./AudioControls"
import { TimeLabel } from "../TimeLabel"
import "./styles.css"

const Player = () => {
    const value = useAudioPlayer()
    const { ready } = value
    if (ready) {
        return (
            <div className="player">
                <AudioControls />
                <AudioSeekBar className="player__seek" />
                <TimeLabel />
            </div>
        )
    }

    return null
}

export const BasicExample: FunctionComponent = () => {
    return (
        <div className="basicExample">
            <BackToHome />
            <AudioPlayerProvider>
                <FileLoader />
                <br />
                <Player />
            </AudioPlayerProvider>
        </div>
    )
}
