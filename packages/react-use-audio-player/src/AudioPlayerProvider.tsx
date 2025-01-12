import { type ComponentProps, createContext, useContext } from "react"
import { type AudioPlayer, useAudioPlayer } from "./useAudioPlayer"

export const context = createContext<AudioPlayer | null>(null)

export const useAudioPlayerContext = () => {
    const ctx = useContext(context)
    if (ctx === null) {
        throw new Error(
            "useAudioPlayerContext must be used within an AudioPlayerProvider"
        )
    }

    return ctx
}

type Props = Omit<ComponentProps<typeof context.Provider>, "value">

export function AudioPlayerProvider({ children }: Props) {
    const player = useAudioPlayer()

    return <context.Provider value={player}>{children}</context.Provider>
}
