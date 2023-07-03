import React, { useEffect } from "react"
import { useAudioPlayer } from "react-use-audio-player"
import "./styles.scss"
import { Howl } from "howler"

// const howl = new Howl({
//     src: "http://mp3-128.streamthejazzgroove.com",
//     html5: true,
//     autoplay: false,
//     format: "mp3"
// })
//
// setInterval(function() {
//     const elem = document.getElementById("stateupdate")
//     const state = howl.state()
//     if (elem) {
//         elem.innerHTML = `<div>${state.toUpperCase()}</div>`
//     }
// }, 100)

export function Streaming() {
    const player = useAudioPlayer()

    useEffect(() => {
        player.load("http://mp3-128.streamthejazzgroove.com", {
            html5: true,
            format: "mp3"
        })
    }, [])

    return (
        <div>
            <div>
                <table>
                    <tbody>
                        {Object.entries(player).map(([k, v]) => {
                            if (typeof v === "function") return null

                            return (
                                <tr key={k}>
                                    <td>{k}</td>
                                    <td>{v?.toString() ?? "--"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div id="stateupdate"></div>
            <button onClick={() => player.togglePlayPause()}>
                {player.playing ? "pause" : "play"}
            </button>
        </div>
    )
}
