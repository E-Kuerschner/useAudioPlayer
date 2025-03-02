import { useState } from "react"
import { useAudioPlayer } from "react-use-audio-player"
import { Link } from "react-router-dom"
import { Player } from "@/Player.tsx"
import { TrackSelect } from "@/TrackSelect.tsx"

const tracks = [
    "/ch_tunes - baby_seal.wav",
    "/ch_tunes - jam_2.wav",
    "/ch_tunes - jam_4.wav",
    "/ch_tunes - jam_8.wav",
    "/ch_tunes - jam_10.wav"
]

export function DeclarativeDemo() {
    const [track, setTrack] = useState(tracks[0])
    const {
        isReady,
        src,
        isPlaying,
        isMuted,
        toggleMute,
        togglePlayPause,
        rate,
        setRate,
        volume,
        setVolume,
        getPosition,
        duration,
        seek,
        isLooping,
        toggleLoop,
        stop,
        isLoading
    } = useAudioPlayer(track, { autoplay: true })

    return (
        <div className="flex flex-col gap-4">
            <Link to="..">go back</Link>
            <TrackSelect
                selectedTrack={track}
                tracks={tracks}
                onSelect={(t) => {
                    if (t) {
                        setTrack(t.url)
                    }
                }}
            />
            {isLoading && <div>Loading...</div>}
            {isReady && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                    <Player
                        // probably need to move the fade out logic into this component
                        isFading={false}
                        onFadeOut={() => {}}
                        src={src}
                        isPlaying={isPlaying}
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                        togglePlayPause={togglePlayPause}
                        rate={rate}
                        setRate={setRate}
                        volume={volume}
                        setVolume={setVolume}
                        getPosition={getPosition}
                        duration={duration}
                        seek={seek}
                        isLooping={isLooping}
                        toggleLoop={toggleLoop}
                        stop={stop}
                        initialVolume={1}
                        initialRate={1}
                    />
                </div>
            )}
        </div>
    )
}
