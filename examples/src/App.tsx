import React from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { BasicExample } from "./GlobalAudioSource/AudioPlayerState"
import { Spotifyish } from "./GlobalAudioSource/SoundLibrary"
import { AutoPlayNextSound } from "./GlobalAudioSource/AutoPlayNextSound"
import { MultipleSounds } from "./MultipleSounds"
import { GlobalAudioSource } from "./GlobalAudioSource"
import "./app.scss"

function ExampleSelect() {
    return (
        <div className="page">
            <h3>Examples</h3>
            <Link to="/globalAudio">useGlobalAudioPlayer examples</Link>
            <Link to="/multipleSounds">Multiple sound sources</Link>
        </div>
    )
}

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route index path="/" element={<ExampleSelect />} />
                    <Route path="globalAudio" element={<GlobalAudioSource />}>
                        <Route path="state" element={<BasicExample />} />
                        <Route path="library" element={<Spotifyish />} />
                        <Route
                            path="playNextSound"
                            element={<AutoPlayNextSound />}
                        />
                    </Route>
                    <Route path="multipleSounds" element={<MultipleSounds />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
