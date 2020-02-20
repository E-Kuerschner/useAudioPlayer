import {
    Actions,
    AudioPlayerState,
    initialState,
    reducer
} from "../src/audioPlayerState"

const buildStatingState = (partialState: Partial<AudioPlayerState> = {}) => ({
    ...initialState,
    ...partialState
})

describe("audio player state reducer", () => {
    test("ON_LOAD sets stopped and unsets loading", () => {
        const state = buildStatingState({ loading: true, stopped: false })

        const nextState = reducer(state, { type: Actions.ON_LOAD })

        expect(nextState).toEqual({
            ...state,
            stopped: true,
            loading: false
        })
    })

    test("ON_PLAY sets playing and unsets stopped", () => {
        const state = buildStatingState({ playing: false, stopped: true })

        const nextState = reducer(state, { type: Actions.ON_PLAY })

        expect(nextState).toEqual({
            ...state,
            playing: true,
            stopped: false
        })
    })

    test("ON_STOP / ON_END set stopped and unset playing", () => {
        const state = buildStatingState({ playing: true, stopped: false })

        let nextState = reducer(state, { type: Actions.ON_STOP })

        expect(nextState).toEqual({
            ...state,
            stopped: true,
            playing: false
        })

        nextState = reducer(state, { type: Actions.ON_END })

        expect(nextState).toEqual({
            ...state,
            stopped: true,
            playing: false
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

    test("RESET_ERRORS unsets error", () => {
        const state = buildStatingState({ error: new Error("blah") })

        const nextState = reducer(state, { type: Actions.RESET_ERRORS })

        expect(nextState).toEqual({ ...state, error: null })
    })

    test("ON_PLAY_ERROR sets error and stopped and unsets playing", () => {
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

    test("ON_LOAD_ERROR sets error and stopped and unsets playing and loading", () => {
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
