import React from "react"
import { BrowserRouter, Link, Route } from "react-router-dom"
import { BasicExample } from "./BasicExample"
import "./App.css"

function ExampleSelect() {
    return (
        <div className="exampleSelect">
            <h3>Examples</h3>
            <Link to="/basic">Basic Example</Link>
        </div>
    )
}

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Route path="/basic" component={BasicExample} />
                <Route exact path="/" component={ExampleSelect} />
            </BrowserRouter>
        </div>
    )
}

export default App
