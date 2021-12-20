import React from "react";
import {AudioPlayerProvider } from "react-use-audio-player";
import {BackToHome} from "../BackToHome";
import Player from "./Player";
import "./styles";

export function AutoPlayNextSound() {
    return (
        <div className="autoPlayNextSound">
            <BackToHome />
            <AudioPlayerProvider>
                <Player />
            </AudioPlayerProvider>
        </div>
    );
}

export default AutoPlayNextSound;
