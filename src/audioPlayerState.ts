import { Howl } from "howler"

export const ActionTypes = {
    START_LOAD: "START_LOAD",
    ON_LOAD: "ON_LOAD",
    ON_ERROR: "ON_ERROR",
    ON_PLAY: "ON_PLAY",
    ON_PAUSE: "ON_PAUSE",
    ON_STOP: "ON_STOP",
    ON_END: "ON_END",
    ON_RATE: "ON_RATE",
    ON_MUTE: "ON_MUTE",
    ON_VOLUME: "ON_VOLUME",
    ON_LOOP: "ON_LOOP"
}

interface BaseAction {
    type: keyof typeof ActionTypes
}

export interface AudioEvent {
    type: Omit<keyof typeof ActionTypes, "ON_ERROR">
    howl: Howl
    toggleValue?: boolean
    debugId?: string
}

export interface ErrorEvent {
    type: "ON_ERROR"
    message: string
}

export type Action = BaseAction | AudioEvent | ErrorEvent

export interface AudioPlayerState {
    src: string | null
    looping: boolean
    isReady: boolean
    paused: boolean
    stopped: boolean
    playing: boolean
    duration: number
    muted: boolean
    rate: number
    volume: number
    error: string | null
}

export function initStateFromHowl(howl?: Howl): AudioPlayerState {
    if (howl === undefined) {
        return {
            src: null,
            isReady: false,
            looping: false,
            duration: 0,
            rate: 1,
            volume: 1,
            muted: false,
            playing: false,
            paused: false,
            stopped: false,
            error: null
        }
    }

    const position = howl.seek()
    const playing = howl.playing()

    return {
        isReady: howl.state() === "loaded",
        // @ts-ignore _src exists
        src: howl._src,
        looping: howl.loop(),
        duration: howl.duration(),
        rate: howl.rate(),
        volume: howl.volume(),
        muted: false,
        playing,
        paused: !playing,
        stopped: !playing && position === 0,
        error: null
    }
}

export function reducer(state: AudioPlayerState, action: Action) {
    switch (action.type) {
        case ActionTypes.START_LOAD:
            return state
        case ActionTypes.ON_LOAD:
            // in React 18 there is a weird race condition where ON_LOAD receives a Howl object that has been unloaded
            // if we detect this case just return the existing state to wait for another action
            if ((action as AudioEvent).howl.state() === "unloaded") {
                return state
            }
            return initStateFromHowl((action as AudioEvent).howl)
        case ActionTypes.ON_ERROR:
            return {
                // this essentially resets state when called with undefined
                ...initStateFromHowl(),
                error: (action as ErrorEvent).message
            }
        case ActionTypes.ON_PLAY:
            return {
                ...state,
                playing: true,
                paused: false,
                stopped: false
            }
        case ActionTypes.ON_PAUSE:
            return {
                ...state,
                playing: false,
                paused: true
            }
        case ActionTypes.ON_STOP: {
            return {
                ...state,
                playing: false,
                paused: false,
                stopped: true
            }
        }
        case ActionTypes.ON_END: {
            return {
                ...state,
                playing: state.looping,
                stopped: !state.looping
            }
        }
        case ActionTypes.ON_MUTE: {
            return {
                ...state,
                muted: (action as AudioEvent).howl.mute() ?? false
            }
        }
        case ActionTypes.ON_RATE: {
            return {
                ...state,
                rate: (action as AudioEvent).howl?.rate() ?? 1.0
            }
        }
        case ActionTypes.ON_VOLUME: {
            return {
                ...state,
                volume: (action as AudioEvent).howl?.volume() ?? 1.0
            }
        }
        case ActionTypes.ON_LOOP: {
            const { toggleValue = false, howl } = action as AudioEvent
            howl.loop(toggleValue)
            return {
                ...state,
                looping: toggleValue
            }
        }
        default:
            return state
    }
}
