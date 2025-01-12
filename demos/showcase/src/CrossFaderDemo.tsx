import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useAudioPlayer } from "react-use-audio-player"
import { Link } from "react-router-dom"
import { VolumeControl } from "@/VolumeControl.tsx"
import { PlaybackControls } from "@/PlaybackControls.tsx"

export function CrossFaderDemo() {
    const [xFadeValue, setXFadeValue] = useState(50)
    const { load: loadSound1, ...song1 } = useAudioPlayer()
    const { load: loadSound2, ...song2 } = useAudioPlayer()

    useEffect(() => {
        loadSound1("/ch_tunes - jam_4.wav", {
            autoplay: false,
            initialVolume: 0.5
        })
        loadSound2("/ch_tunes - baby_seal.wav", {
            autoplay: false,
            initialVolume: 0.5
        })
    }, [loadSound1, loadSound2])

    const togglePlayingBoth = useCallback(() => {
        song1.togglePlayPause()
        song2.togglePlayPause()
    }, [song1, song2])

    const handleFade = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value)
            setXFadeValue(value)
            const ratio = value / 100
            song1.setVolume(1 - ratio)
            song2.setVolume(ratio)
        },
        [song1, song2]
    )

    const handleStop = () => {
        song1.stop()
        song2.stop()
    }

    return (
        <div>
            <Link
                to=".."
                onClick={() => {
                    // TODO test if this is needed in v4
                    song1.cleanup()
                    song2.cleanup()
                }}
            >
                go back
            </Link>
            <div className="my-8 flex items-center gap-20">
                <div className="">
                    <p>{song1.src}</p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="song1vol">volume</label>
                        <VolumeControl
                            disabled
                            inputId="song1vol"
                            volume={song1.volume}
                        />
                    </div>
                </div>

                <div className="">
                    <p>{song2.src}</p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="song2vol">volume</label>
                        <VolumeControl
                            disabled
                            inputId="song2vol"
                            volume={song2.volume}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-20">
                <PlaybackControls
                    isPlaying={song1.isPlaying}
                    onPlayPause={togglePlayingBoth}
                    onStop={handleStop}
                />
                <span className="flex items-center gap-2">
                    <label htmlFor="crossfader">
                        Adjust the slider to fade between the two songs:
                    </label>
                    <input
                        id="crossfader"
                        type="range"
                        value={xFadeValue}
                        onChange={handleFade}
                    />
                </span>
            </div>
        </div>
    )
}
