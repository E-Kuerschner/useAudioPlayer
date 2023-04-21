import React, {FunctionComponent, useState} from "react"
import { Route, Link, RouteChildrenProps, Switch } from "react-router-dom"
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player"
import { BackToHome } from "../BackToHome"
import { AudioSeekBar } from "../AudioSeekBar"
import { VolumeControl } from "../VolumeControl"
import { TimeLabel } from "../TimeLabel"
import "./styles.scss"

const PlayBar = () => {
    const { togglePlayPause, playing, ready, rate } = useAudioPlayer()
    const [speed, setSpeed] = useState<number | void>(rate())
    return (
        <div className="playBar">
            <div className="playBar__spacer"/>
            <div className="playBar__mainControls">
                <button
                    className="playBar__playButton"
                    onClick={togglePlayPause}
                    disabled={!ready}
                >
                    <i className={`fa ${playing ? "fa-pause" : "fa-play"}`} />
                </button>
                <div className="playBar__timeStuff">
                    <AudioSeekBar className="playBar__seek" />
                    <TimeLabel />
                </div>
                <VolumeControl />
            </div>
            <div className="playBar__rateControl">
                <span>Playback Speed:</span>
                <select className="playBar__rateSelect" name="rateSelect" id="rate" defaultValue="1" onChange={e => rate(Number(e.target.value))}>
                    <option value="0.5">1/2x</option>
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        </div>
    )
}

const SoundLibrary: FunctionComponent = () => {
    const sounds = ["/cats.mp3", "/dog.mp3"]
    const { load, playing } = useAudioPlayer()
    return (
        <div className="soundLibrary page">
            <div className="page__title">Sound Library</div>
            <div className="soundLibrary__sounds">
                {sounds.map((src, i) => {
                    return (
                        <div
                            key={i}
                            className="track"
                            onClick={() => load({ src, autoplay: !playing })}
                        >
                            <i className="fa fa-music track__icon" />
                            <div className="track__title">
                                {src.slice(1, src.indexOf("."))}
                            </div>
                        </div>
                    )
                })}
                <div
                    className="track"
                    onClick={() =>
                        load({
                            src: "/cats.mp3",
                            autoplay: !playing,
                            html5: true
                        })
                    }
                >
                    <i className="fa fa-music track__icon" />
                    <div className="track__title">cats html5</div>
                </div>
            </div>
        </div>
    )
}

const AccountDetails: FunctionComponent = () => {
    return (
        <div className="page">
            <div className="page__title">Account Details</div>
            <p>Username</p>
            <p>Premium Subscriber: true</p>
            <p>... more deets</p>
        </div>
    )
}

export const Spotifyish: FunctionComponent<RouteChildrenProps> = props => {
    const url = props.match?.url
    return (
        <AudioPlayerProvider>
            <div className="globalPlayerExample">
                <div className="navigation">
                    <BackToHome className="navigation__link" />
                    <Link className="navigation__link" to={`${url}/library`}>
                        Sound Library
                    </Link>
                    <Link className="navigation__link" to={`${url}/account`}>
                        Account Details
                    </Link>
                </div>
                <Switch>
                    <Route path={`${url}/library`} component={SoundLibrary} />
                    <Route path={`${url}/account`} component={AccountDetails} />
                </Switch>
                <PlayBar />
            </div>
        </AudioPlayerProvider>
    )
}
