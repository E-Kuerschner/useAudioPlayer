import React from "react"
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import { BasicExample } from "./BasicExample"
import { Spotifyish } from "./Spotifyish"
import { AutoPlayNextSound } from "./AutoPlayNextSound"
import "./App.css"

function ExampleSelect() {
    return (
        <div className="exampleSelect">
            <h3>Examples</h3>
            <Link to="/basic">Basic Example</Link>
            <Link to="/spotifyish/library">Spotify-ish</Link>
            <Link to="/playNextSound">Auto Play Next Example</Link>
        </div>
    )
}

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route path="/basic" component={BasicExample} />
                    <Route path="/spotifyish" component={Spotifyish} />
                    <Route path="/playNextSound" component={AutoPlayNextSound} />
                    <Route exact path="/" component={ExampleSelect} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default App
