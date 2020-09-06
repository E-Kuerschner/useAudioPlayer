import {
    Actions,
    AudioPlayerState,
    initialState,
    reducer
} from "./audioPlayerState"

const buildStatingState = (partialState: Partial<AudioPlayerState> = {}) => ({
    ...initialState,
    ...partialState
})

describe("audio player state reducer", () => {
    test("START_LOAD sets [loading, stopped] and unsets [error, duration, ready]", () => {
        const state = buildStatingState({
            loading: false,
            duration: 100,
            ready: true,
            stopped: false,
            error: new Error("WHAT")
        })

        const nextState = reducer(state, {
            type: Actions.START_LOAD
        })

        expect(nextState).toEqual({
            ...state,
            loading: true,
            stopped: true,
            duration: 0,
            ready: false,
            error: null
        })
    })

    test("ON_LOAD sets [duration, ready] and unsets [loading, ended]", () => {
        const state = buildStatingState({
            loading: true,
            duration: 0,
            ready: false,
            ended: true
        })

        const nextState = reducer(state, {
            type: Actions.ON_LOAD,
            duration: 100
        })

        expect(nextState).toEqual({
            ...state,
            loading: false,
            duration: 100,
            ready: true,
            ended: false
        })
    })

    test("ON_PLAY sets playing and unsets [stopped, ended]", () => {
        const state = buildStatingState({
            playing: false,
            stopped: true,
            ended: true
        })

        const nextState = reducer(state, { type: Actions.ON_PLAY })

        expect(nextState).toEqual({
            ...state,
            playing: true,
            stopped: false,
            ended: false
        })
    })

    test("ON_STOP sets stopped and unsets playing", () => {
        const state = buildStatingState({ playing: true, stopped: false })

        let nextState = reducer(state, { type: Actions.ON_STOP })

        expect(nextState).toEqual({
            ...state,
            stopped: true,
            playing: false
        })
    })

    test("ON_END sets [stopped, ended] and unsets playing", () => {
        const state = buildStatingState({
            playing: true,
            stopped: false,
            ended: false
        })

        const nextState = reducer(state, { type: Actions.ON_END })

        expect(nextState).toEqual({
            ...state,
            stopped: true,
            playing: false,
            ended: true
        })
    })

    test("ON_PAUSE unsets playing", () => {
        const state = buildStatingState({ playing: true })

        const nextState = reducer(state, { type: Actions.ON_PAUSE })

        expect(nextState).toEqual({
            ...state,
            playing: false
        })
    })

    test("ON_PLAY_ERROR sets [error, stopped] and unsets playing", () => {
        const state = buildStatingState({
            error: null,
            stopped: false,
            playing: true
        })
        const playError = new Error("PLAY ERROR")

        const nextState = reducer(state, {
            type: Actions.ON_PLAY_ERROR,
            error: playError
        })

        expect(nextState).toEqual({
            ...state,
            error: playError,
            stopped: true,
            playing: false
        })
    })

    test("ON_LOAD_ERROR sets [error, stopped] and unsets [playing, loading]", () => {
        const state = buildStatingState({
            error: null,
            playing: true,
            loading: true,
            stopped: false
        })
        const loadError = new Error("LOAD ERROR")

        const nextState = reducer(state, {
            type: Actions.ON_LOAD_ERROR,
            error: loadError
        })

        expect(nextState).toEqual({
            ...state,
            error: loadError,
            playing: false,
            loading: false,
            stopped: true
        })
    })
})
