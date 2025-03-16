import { useCallback, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAudioPlayer } from "react-use-audio-player"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { VolumeControl } from "./VolumeControl"
import { PlaybackRateControl } from "./PlaybackRateControl"
import { TrackSelect } from "./TrackSelect"
import { Link } from "react-router-dom"
import { Player } from "@/Player.tsx"

const tracks = [
    "/ch_tunes - baby_seal.wav",
    "/ch_tunes - jam_2.wav",
    "/ch_tunes - jam_4.wav",
    "/ch_tunes - jam_8.wav",
    "/ch_tunes - jam_10.wav",
    "/does_not_exist.wav"
]

export function FullFeaturesDemo() {
    // initial state for loading sounds
    const [autoplay, setAutoplay] = useState(false)
    const [initialLoop, setInitialLoop] = useState(false)
    const [initialVolume, setInitialVolume] = useState(1)
    const [initialPlaybackRate, setInitialPlaybackRate] = useState(1)

    const [playerFadeOut, setPlayerFadeOut] = useState(false)

    const {
        isLoading,
        load,
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
        error,
        stop,
        fade,
        cleanup
    } = useAudioPlayer()

    const handleFadeOutToEnd = () => {
        setPlayerFadeOut(true)
        const secondsDiff = duration - getPosition()
        fade(volume, 0, secondsDiff * 1000)
    }

    const resetFadeOut = useCallback(() => {
        // TODO there is a bug where the current state is not captured
        // the useAudioPlayer hook calls this function and the old state is captured
        setVolume(initialVolume)
        setPlayerFadeOut(false)
    }, [setVolume, initialVolume, setPlayerFadeOut])

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const handleTrackSelect = (src?: string) => {
        if (src) {
            load(src, {
                html5: params.get("html5") === "true",
                autoplay,
                initialVolume: initialVolume,
                initialRate: initialPlaybackRate,
                loop: initialLoop,
                onstop: resetFadeOut,
                onend: () => {
                    resetFadeOut()
                    alert("track ended")
                }
            })
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
            {/* TODO may not need for v4 */}
            <Link to=".." onClick={cleanup}>
                go back
            </Link>
            <div className="space-y-4 border-2 rounded-lg border-gray-200 p-8 shadow-sm bg-background">
                <h2 className="text-2xl font-bold">
                    Track Selection and Settings
                </h2>
                <TrackSelect
                    tracks={tracks}
                    onSelect={(t) => handleTrackSelect(t?.url)}
                />
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="autoplay"
                            checked={autoplay}
                            onCheckedChange={setAutoplay}
                        />
                        <Label htmlFor="autoplay">Autoplay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="loop"
                            checked={initialLoop}
                            onCheckedChange={setInitialLoop}
                        />
                        <Label htmlFor="loop">Loop</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="initial-volume">Initial Volume</Label>
                        <VolumeControl
                            inputId="initial-volume"
                            onChange={setInitialVolume}
                            volume={initialVolume}
                            initialVolume={initialVolume}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="initial-rate">
                            Initial Playback Rate
                        </Label>
                        <PlaybackRateControl
                            rate={initialPlaybackRate.toString()}
                            onChange={setInitialPlaybackRate}
                            inputId="initial-rate"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {error && <div className="text-2xl text-red-800">{error}</div>}
                {isLoading && <div className="text-2xl">Loading...</div>}
                {isReady && (
                    <Player
                        isFading={playerFadeOut}
                        onFadeOut={handleFadeOutToEnd}
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
                        initialVolume={initialVolume}
                        initialRate={initialPlaybackRate}
                    />
                )}
            </div>
        </div>
    )
}
