export enum Actions {
    ON_LOAD,
    ON_PLAY,
    ON_END,
    ON_PAUSE,
    ON_STOP,
    ON_PLAY_ERROR,
    ON_LOAD_ERROR,
    RESET_ERRORS
}

interface BaseAction {
    type: Actions
}

interface ErrorAction extends BaseAction {
    error: Error
}

type Action = BaseAction | ErrorAction

export interface AudioPlayerState {
    loading: boolean
    playing: boolean
    stopped: boolean
    error: Error | null
}

export const initialState: AudioPlayerState = {
    loading: true,
    playing: false,
    stopped: true,
    error: null
}

export function reducer(state: AudioPlayerState, action: Action) {
    switch (action.type) {
        case Actions.ON_LOAD:
            return {
                ...state,
                stopped: true,
                loading: false
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
        case Actions.RESET_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}
