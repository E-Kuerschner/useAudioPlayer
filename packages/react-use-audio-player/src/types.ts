/**
 * Describes the full API of state-mutating actions one can perform on the audio
 */
export interface AudioControls {
    // common player controls
    /** Begins or resumes playback of the audio */
    play: () => void
    /** Pauses the audio at its current playhead */
    pause: () => void
    /** Plays/Pauses the audio */
    togglePlayPause: () => void
    /** Stops the audio, putting thep playhead back at 0 */
    stop: () => void
    // player settings
    /** Sets the volume of the audio. Takes a float between 0.1 and 1, where 1 is full volume */
    setVolume: (volume: number) => void
    /** Sets the playback rate of the audio. Takes a floating point number, where 1 is normal speed */
    setRate: (speed: number) => void
    /** Mutes the audio */
    mute: () => void
    /** Unmutes the audio */
    unmute: () => void
    /** Toggle the muted state */
    toggleMute: () => void
    /** Sets the audio to loop upon completion */
    loopOn: () => void
    /** Will plut the audio in a stopped state upon completion */
    loopOff: () => void
    /** Toggle the loop behavior */
    toggleLoop: () => void
    // other player features
    /** Fades the volume between [startVol] and [endVol] over [durationMs] miliseconds */
    fade: (startVol: number, endVol: number, durationMs: number) => void
    /** Moves the audio playhead to [seconds] seconds */
    seek: (seconds: number) => void
    /** Returns the current position of the audio playhead in seconds */
    getPosition: () => number
}

/**
 * Represents the options for loading an audio resource.
 *
 * This is a wrapper around many of the Howler HowlOptions interface.
 * For more detailed information, please refer to the Howler [documentation](https://github.com/goldfire/howler.js#documentation)
 */
export interface AudioLoadOptions {
    /** When true, the audio will loop upon finishing. This may be changed later with the toggleLoop method */
    loop?: boolean
    /** The starting volume for the newly loaded audio. This may be changed later with the volume() method */
    initialVolume?: number
    /** When true, the audio will load in the muted state. This may be changed later with the toggleMute() method */
    initialMute?: boolean
    /** The starting playback rate for the newly loaded audio. This may be changed later with the rate() method */
    initialRate?: number
    /** Specifies the audio format. Required if an extension is not present in the src argument */
    format?: string
    /** When true, the audio will begin playback immediately after loading */
    autoplay?: boolean
    /** When true, an HTML5 Audio tag will be used to load the audio instead of the modern Web Audio API */
    html5?: boolean
    /** Callback that will be triggered when the audio is stopped */
    onstop?: () => void | undefined
    /** Callback that will be triggered when the audio is paused */
    onpause?: () => void | undefined
    /** Callback that will be triggered when the audio is successfully loaded */
    onload?: () => void | undefined
    /** Callback that will be triggered when the audio reaches its end */
    onend?: () => void | undefined
    /** Callback that will be triggered when the audio starts playing */
    onplay?: () => void | undefined
}
