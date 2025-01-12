import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx"

type Props = {
    inputId?: string
    rate?: string
    onChange: (rate: number) => void
    initialRate?: string
}

export function PlaybackRateControl({
    inputId,
    initialRate,
    rate,
    onChange
}: Props) {
    return (
        <Select
            defaultValue={initialRate}
            value={rate ?? initialRate}
            onValueChange={(value) => onChange(Number.parseFloat(value))}
        >
            <SelectTrigger id={inputId}>
                <SelectValue placeholder="Select playback rate" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
            </SelectContent>
        </Select>
    )
}
