import { Howl } from "howler"

export enum ActionTypes {
    START_LOAD = "START_LOAD",
    ON_LOAD = "ON_LOAD",
    ON_ERROR = "ON_ERROR",
    ON_PLAY = "ON_PLAY",
    ON_PAUSE = "ON_PAUSE",
    ON_STOP = "ON_STOP",
    ON_END = "ON_END",
    ON_RATE = "ON_RATE",
    ON_MUTE = "ON_MUTE",
    ON_VOLUME = "ON_VOLUME",
    ON_LOOP = "ON_LOOP"
}

export type StartLoadAction = {
    type: ActionTypes.START_LOAD
    linkMediaSession?: boolean
    howl: Howl
}

export type AudioEventAction = {
    type: Exclude<ActionTypes, ActionTypes.START_LOAD | ActionTypes.ON_ERROR>
    howl: Howl
    toggleValue?: boolean
    debugId?: string
}

export type ErrorEvent = {
    type: ActionTypes.ON_ERROR
    message: string
}

export type Action = StartLoadAction | AudioEventAction | ErrorEvent

export interface AudioPlayerState {
    src: string | null
    looping: boolean
    isReady: boolean
    isLoading: boolean
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
            isLoading: false,
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
        isLoading: howl.state() === "loading",
        // @ts-ignore _src exists
        src: howl._src,
        looping: howl.loop(),
        duration: howl.duration(),
        rate: howl.rate(),
        volume: howl.volume(),
        muted: howl.mute(),
        playing,
        paused: !playing,
        stopped: !playing && position === 0,
        error: null
    }
}

export function reducer(state: AudioPlayerState, action: Action) {
    switch (action.type) {
        case "START_LOAD":
            return {
                // when called without a Howl object it will return an empty/init state object
                ...initStateFromHowl(),
                isLoading: true,
                linkMediaSession: action.linkMediaSession ?? false
            }
        case "ON_LOAD":
            // in React 18 there is a weird race condition where ON_LOAD receives a Howl object that has been unloaded
            // if we detect this case just return the existing state to wait for another action
            if (action.howl.state() === "unloaded") {
                return state
            }
            return initStateFromHowl(action.howl)
        case "ON_ERROR":
            return {
                // this essentially resets state when called with undefined
                ...initStateFromHowl(),
                error: action.message
            }
        case "ON_PLAY":
            return {
                ...state,
                playing: true,
                paused: false,
                stopped: false
            }
        case "ON_PAUSE":
            return {
                ...state,
                playing: false,
                paused: true
            }
        case "ON_STOP": {
            return {
                ...state,
                playing: false,
                paused: false,
                stopped: true
            }
        }
        case "ON_END": {
            return {
                ...state,
                playing: state.looping,
                stopped: !state.looping
            }
        }
        case "ON_MUTE": {
            return {
                ...state,
                muted: action.howl.mute() ?? false
            }
        }
        case "ON_RATE": {
            return {
                ...state,
                rate: action.howl?.rate() ?? 1.0
            }
        }
        case "ON_VOLUME": {
            return {
                ...state,
                volume: action.howl?.volume() ?? 1.0
            }
        }
        case "ON_LOOP": {
            const { toggleValue = false, howl } = action
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
