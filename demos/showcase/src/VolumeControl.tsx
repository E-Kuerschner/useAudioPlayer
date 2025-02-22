import { type ClassValue, clsx } from "clsx"
import { Slider } from "@/components/ui/slider.tsx"

type Props = {
    inputId?: string
    volume?: number
    onChange?: (volume: number) => void
    initialVolume?: number
    className?: ClassValue
    disabled?: boolean
}

export function VolumeControl({
    inputId,
    volume,
    onChange,
    initialVolume,
    className,
    disabled
}: Props) {
    return (
        <Slider
            disabled={disabled}
            id={inputId}
            max={1}
            step={0.1}
            className={clsx("w-32", className)}
            defaultValue={[initialVolume ?? 1]}
            value={volume !== undefined ? [volume] : [initialVolume ?? 1]}
            onValueChange={(value) => onChange?.(value[0])}
        />
    )
}
