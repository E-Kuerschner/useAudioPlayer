import React, { useState } from "react";
import {useAudioPlayer, useAudioPosition} from "react-use-audio-player";
import sound1 from "./sound/jam10 - master.wav";
import sound2 from "./sound/baby seal - master.wav";

const songs = [sound1, sound2];
export function AutoPlayNextSound() {
    const [songIndex, setSongIndex] = useState(0);

    const { togglePlayPause, ready, playing } = useAudioPlayer({
        src: songs[songIndex],
        html5: true,
        autoplay: true,
        onend: () => {
            setSongIndex(index => index + 1);
        }
    });

    const { position, duration, seek } = useAudioPosition({
        highRefreshRate: true
    });

    if (!ready) return <h1>audio {songs[songIndex]} is loading</h1>
    return (
        <>
            <div>Currently playing: {songs[songIndex]}</div>
            <button onClick={togglePlayPause}>
                {playing ? "pause" : "play"}
            </button>
            <button onClick={() => seek(duration * 0.99)}>skip to end</button>
            <div>
                {position.toFixed(2)} / {duration.toFixed(2)}
            </div>
        </>
    );
}

export default AutoPlayNextSound;
