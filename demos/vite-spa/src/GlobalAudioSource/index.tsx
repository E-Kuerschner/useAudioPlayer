import { Link, Outlet, useMatch } from "react-router-dom"
import { PlayBar } from "./PlayBar"
import "./styles.scss"

const ExampleSelect = () => {
    return (
        <>
            <Link to="..">go back</Link>
            <p>
                The following examples leverage useGlobalAudioPlayer to control
                a single, global audio source. At any time, this audio can be
                managed by the playbar at the bottom of the page.
            </p>
            <h4>Examples</h4>
            <Link to="state">Audio Player State</Link>
            <Link to="library">Full Sound Library</Link>
            <Link to="playNextSound">Auto Play Next Example</Link>
        </>
    )
}

const ExitExample = () => {
    return (
        <Link to=".." relative="path">
            Exit Example
        </Link>
    )
}

export const GlobalAudioSource = () => {
    const matches = useMatch("/globalAudio")
    return (
        <div className="page globalAudioSourceExamples">
            <div className="globalAudioSourceExamples__header">
                {matches !== null ? <ExampleSelect /> : <ExitExample />}
            </div>
            <Outlet />
            <PlayBar />
        </div>
    )
}
