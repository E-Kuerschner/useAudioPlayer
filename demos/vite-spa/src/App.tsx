import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { BasicExample } from "./GlobalAudioSource/AudioPlayerState"
import { Spotifyish } from "./GlobalAudioSource/SoundLibrary"
import { AutoPlayNextSound } from "./GlobalAudioSource/AutoPlayNextSound"
import { MultipleSounds } from "./MultipleSounds"
import { GlobalAudioSource } from "./GlobalAudioSource"
import { Streaming } from "./Streaming"
import "./app.scss"

function ExampleSelect() {
    return (
        <div className="page">
            <h3>Examples</h3>
            <Link to="/globalAudio">useAudioPlayerContext examples</Link>
            <Link to="/multipleSounds">Multiple sound sources</Link>
            <Link to="/streaming">Streaming example</Link>
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
                    <Route path="streaming" element={<Streaming />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
