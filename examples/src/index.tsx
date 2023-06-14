import React from "react"
import ReactDOM from "react-dom/client"
import "./app.scss"
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById("root")
// )
