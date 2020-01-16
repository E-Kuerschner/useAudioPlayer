import React, { FunctionComponent } from "react"
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player"
import { AudioSeekBar } from "./AudioSeekBar"
import { FileLoader } from "./FileLoader"
import { AudioControls } from "./AudioControls"
import { BackToHome } from "../BackToHome"
import "./styles.css"

const Player = () => {
    const value = useAudioPlayer()
    const { ready } = value
    if (ready) {
        return (
            <>
                <AudioControls />
                <AudioSeekBar />
            </>
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
