export enum Actions {
    START_LOAD,
    ON_LOAD,
    ON_PLAY,
    ON_END,
    ON_PAUSE,
    ON_STOP,
    ON_PLAY_ERROR,
    ON_LOAD_ERROR
}

interface BaseAction {
    type: Actions
}

interface ErrorAction extends BaseAction {
    error: Error
}

interface LoadAction extends BaseAction {
    duration: number
}

type Action = BaseAction | ErrorAction | LoadAction

export interface AudioPlayerState {
    loading: boolean
    playing: boolean
    stopped: boolean
    error: Error | null
    duration: number
    ready: boolean
}

export const initialState: AudioPlayerState = {
    loading: true,
    playing: false,
    stopped: true,
    error: null,
    duration: 0,
    ready: false
}

export function reducer(state: AudioPlayerState, action: Action) {
    switch (action.type) {
        case Actions.START_LOAD:
            return {
                ...state,
                loading: true,
                stopped: true,
                ready: false,
                error: null,
                duration: 0
            }
        case Actions.ON_LOAD:
            return {
                ...state,
                loading: false,
                duration: (action as LoadAction).duration,
                ready: true
            }
        case Actions.ON_PLAY:
            return {
                ...state,
                playing: true,
                stopped: false
            }
        case Actions.ON_STOP:
        case Actions.ON_END:
            return {
                ...state,
                stopped: true,
                playing: false
            }
        case Actions.ON_PAUSE:
            return {
                ...state,
                playing: false
            }
        case Actions.ON_PLAY_ERROR:
            return {
                ...state,
                playing: false,
                stopped: true,
                error: (action as ErrorAction).error
            }
        case Actions.ON_LOAD_ERROR:
            return {
                ...state,
                playing: false,
                stopped: true,
                loading: false,
                error: (action as ErrorAction).error
            }
        default:
            return state
    }
}
