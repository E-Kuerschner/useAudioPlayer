import { Button } from "@/components/ui/button"
import { Pause, Play, Square } from "lucide-react"

type Props = {
    isPlaying: boolean
    onPlayPause: () => void
    onStop: () => void
    disabled?: boolean
}

export function PlaybackControls({
    isPlaying,
    disabled,
    onPlayPause,
    onStop
}: Props) {
    return (
        <div className="flex gap-2">
            <Button disabled={disabled} onClick={onStop}>
                <Square className="h-4 w-4" />
            </Button>
            <Button disabled={disabled} onClick={onPlayPause}>
                {isPlaying ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
}
