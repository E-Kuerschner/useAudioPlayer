import React from "react"
import { AudioPlayerContext } from "./types"

export const context = React.createContext<AudioPlayerContext | null>(null)
