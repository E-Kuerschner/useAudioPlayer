import { useAudioPlayer } from "react-use-audio-player"
import { useEffect } from "react"
import { PlaybackControls } from "@/PlaybackControls.tsx"
import { Link } from "react-router-dom"

export function StreamingDemo() {
    const { load, ...player } = useAudioPlayer()

    useEffect(() => {
        load("http://mp3-128.streamthejazzgroove.com", {
            html5: true,
            format: "mp3"
        })
    }, [load])

    return (
        <div className="flex flex-col gap-4">
            <Link
                to=".."
                onClick={() => {
                    player.cleanup()
                }}
            >
                go back
            </Link>
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
            <PlaybackControls
                disabled={player.isLoading}
                isPlaying={player.isPlaying}
                onPlayPause={player.togglePlayPause}
                onStop={player.stop}
            />
        </div>
    )
}
