import React from "react";
import { HowlOptions, Howl } from "howler";
import { AudioPlayerState } from "./audioPlayerState";
export interface AudioPlayerContext extends AudioPlayerState {
    player: Howl | null;
    load: (args: HowlOptions) => void;
}
export interface AudioPlayerPositionContext {
    position: number;
    setPosition: React.Dispatch<number>;
}
