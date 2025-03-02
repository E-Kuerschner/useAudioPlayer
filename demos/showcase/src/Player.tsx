import { Switch } from "@/components/ui/switch.tsx"
import { Label } from "@/components/ui/label.tsx"

import { SeekBar } from "./SeekBar.tsx"
import { PlaybackControls } from "./PlaybackControls.tsx"
import { VolumeControl } from "./VolumeControl.tsx"
import { MuteButton } from "./MuteButton.tsx"
import { PlaybackRateControl } from "./PlaybackRateControl.tsx"
import type { AudioPlayer } from "react-use-audio-player"

type Props = Pick<
    AudioPlayer,
    | "isLooping"
    | "toggleLoop"
    | "getPosition"
    | "duration"
    | "src"
    | "seek"
    | "isPlaying"
    | "togglePlayPause"
    | "setVolume"
    | "volume"
    | "toggleMute"
    | "isMuted"
    | "rate"
    | "setRate"
    | "stop"
> & {
    isFading: boolean
    onFadeOut: () => void
    initialRate?: number
    initialVolume?: number
}

export function Player({
    src,
    isLooping,
    toggleLoop,
    isFading,
    onFadeOut,
    getPosition,
    seek,
    duration,
    setVolume,
    volume,
    isMuted,
    toggleMute,
    togglePlayPause,
    isPlaying,
    rate,
    setRate,
    stop,
    initialVolume,
    initialRate
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{src ?? ""}</div>
                <span className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="loop"
                            checked={isLooping}
                            onCheckedChange={toggleLoop}
                        />
                        <Label htmlFor="loop">Loop</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            disabled={isFading}
                            id="fade"
                            checked={isFading}
                            onCheckedChange={onFadeOut}
                        />
                        <Label htmlFor="fade">Fade out</Label>
                    </div>
                </span>
            </div>
            <SeekBar
                onSeek={seek}
                getPosition={getPosition}
                duration={duration}
            />
            <div className="flex items-center space-x-4">
                <PlaybackControls
                    isPlaying={isPlaying}
                    onPlayPause={togglePlayPause}
                    onStop={stop}
                />
                <VolumeControl
                    onChange={setVolume}
                    volume={volume}
                    initialVolume={initialVolume}
                />
                <MuteButton muted={isMuted} onChange={toggleMute} />
                <PlaybackRateControl
                    rate={rate.toString()}
                    onChange={setRate}
                    initialRate={initialRate?.toString()}
                    inputId="initial-rate"
                />
            </div>
        </div>
    )
}
