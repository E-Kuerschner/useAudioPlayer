import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { AudioPlayerProvider } from "react-use-audio-player"
import { AudioPlayerState } from "./routes/AudioPlayerState"
import { Spotifyish } from "./routes/SoundLibrary"
import { PlayBar } from "./PlayBar/PlayBar.tsx"
import "./app.scss"

function ExampleSelect() {
    return (
        <div className="page">
            <p>
                The following examples leverage AudioPlayerProvider and
                useAudioPlayerContext to control a single, shared audio source.
                At any time, this audio can be managed by the playbar at the
                bottom of the application. Try switching between pages and
                notice the audio state is uninterrupted and persists and move
                about the app.
            </p>
            <h4>Examples</h4>
            <Link to="state">AudioPlayer State</Link>
            <Link to="library">Sound Library</Link>
        </div>
    )
}

function App() {
    return (
        <AudioPlayerProvider>
            <div className="app">
                <BrowserRouter>
                    <Routes>
                        <Route index path="/" element={<ExampleSelect />} />
                        <Route path="state" element={<AudioPlayerState />} />
                        <Route path="library" element={<Spotifyish />} />
                    </Routes>
                </BrowserRouter>
                <PlayBar />
            </div>
        </AudioPlayerProvider>
    )
}

export default App
