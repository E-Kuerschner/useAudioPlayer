import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx"

interface Track {
    id: string
    name: string
    url: string
}

type Props = {
    tracks: string[] | Track[]
    selectedTrack?: string
    onSelect: (track: Track | null) => void
}

export function TrackSelect({ tracks, onSelect, selectedTrack }: Props) {
    const trackList: Track[] = tracks.map((t, i) => {
        if (typeof t === "string") {
            return { id: t, name: `Track ${i + 1}`, url: t }
        }
        return t
    })

    return (
        <Select
            onValueChange={(value) =>
                onSelect(trackList.find((t) => t.id === value) || null)
            }
            value={selectedTrack}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a track" />
            </SelectTrigger>
            <SelectContent>
                {trackList.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                        {track.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
