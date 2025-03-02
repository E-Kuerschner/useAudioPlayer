import { useAudioPlayer } from "react-use-audio-player"
import { useLoaderData } from "@remix-run/react"

export const loader = () => {
    return {
        tracks: ["/ch_tunes - jam_4.wav"]
    }
}

export default function DemoRoute() {
    const { tracks } = useLoaderData<typeof loader>()

    const { togglePlayPause, isPlaying, src } = useAudioPlayer(tracks[0])

    const handleClick = () => {
        togglePlayPause()
    }
    return (
        <div className="p-8 flex flex-col gap-4">
            <p className="text-lg">{src}</p>
            <button
                className="self-start border-gray-200 border-2 min-w-[100px] rounded-md p-2"
                onClick={handleClick}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    )
}
