import { Button } from "@/components/ui/button.tsx"
import { Volume2, VolumeX } from "lucide-react"

type Props = {
    muted: boolean
    onChange: (muted: boolean) => void
}

export function MuteButton({ muted, onChange }: Props) {
    return (
        <Button variant="outline" size="icon" onClick={() => onChange(!muted)}>
            {muted ? (
                <VolumeX className="h-4 w-4" />
            ) : (
                <Volume2 className="h-4 w-4" />
            )}
        </Button>
    )
}
