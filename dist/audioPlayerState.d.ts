export declare enum Actions {
    START_LOAD = 0,
    ON_LOAD = 1,
    ON_PLAY = 2,
    ON_END = 3,
    ON_PAUSE = 4,
    ON_STOP = 5,
    ON_PLAY_ERROR = 6,
    ON_LOAD_ERROR = 7
}
interface BaseAction {
    type: Actions;
}
interface ErrorAction extends BaseAction {
    error: Error;
}
interface LoadAction extends BaseAction {
    duration: number;
}
declare type Action = BaseAction | ErrorAction | LoadAction;
export interface AudioPlayerState {
    loading: boolean;
    playing: boolean;
    stopped: boolean;
    error: Error | null;
    duration: number;
    ready: boolean;
    ended: boolean;
}
export declare const initialState: AudioPlayerState;
export declare function reducer(state: AudioPlayerState, action: Action): AudioPlayerState;
export {};
