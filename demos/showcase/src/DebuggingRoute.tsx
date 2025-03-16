import { useEffect, useRef } from "react"
import { Howl } from "howler"

export const DebuggingRoute = () => {
    const soundRef = useRef<Howl | null>(null)
    useEffect(() => {
        if (soundRef.current) return

        soundRef.current = new Howl({
            src: ["/ch_tunes - baby_seal.wav"],
            html5: true // Enables html5 audio for streaming large files
        })

        soundRef.current.on("seek", function () {
            console.log(soundRef.current?.state())
        })
        soundRef.current.on("load", function () {
            console.log(soundRef.current?.state())
        })
    }, [])

    return (
        <div>
            <button onClick={() => soundRef.current?.play()}>Play</button>
            <button onClick={() => soundRef.current?.seek(10)}>seek</button>
        </div>
    )
}
