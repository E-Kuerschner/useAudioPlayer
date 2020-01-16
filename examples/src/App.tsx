import React from "react"
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import { BasicExample } from "./BasicExample"
import { GlobalPlayerExample } from "./GlobalPlayerExample"
import "./App.css"

function ExampleSelect() {
    return (
        <div className="exampleSelect">
            <h3>Examples</h3>
            <Link to="/basic">Basic Example</Link>
            <Link to="/globalPlayer">Global Player Example</Link>
        </div>
    )
}

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route path="/basic" component={BasicExample} />
                    <Route
                        path="/globalPlayer"
                        component={GlobalPlayerExample}
                    />
                    <Route exact path="/" component={ExampleSelect} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default App
