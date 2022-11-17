import { Howl, HowlOptions } from "howler";
import { AudioPlayerContext } from "./types";
declare const noop: () => void;
export declare type AudioPlayerControls = AudioPlayerContext & {
    play: Howl["play"] | typeof noop;
    pause: Howl["pause"] | typeof noop;
    stop: Howl["stop"] | typeof noop;
    mute: Howl["mute"] | typeof noop;
    volume: Howl["volume"] | typeof noop;
    fade: Howl["fade"] | typeof noop;
    togglePlayPause: () => void;
};
export declare const useAudioPlayer: (options?: HowlOptions | undefined) => AudioPlayerControls;
export {};
