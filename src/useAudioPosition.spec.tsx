import React from "react"
import { Howl } from "howler"
import { renderHook } from "@testing-library/react-hooks"
import {
    AudioPlayerProvider,
    AudioPlayerProviderProps
} from "./AudioPlayerProvider"
import { useAudioPosition } from "./useAudioPosition"

const wrapper: React.FunctionComponent<AudioPlayerProviderProps> = ({
    children,
    value
}) => {
    return <AudioPlayerProvider value={value}>{children}</AudioPlayerProvider>
}

describe("useAudioPosition", () => {
    it("returns a percentage representing the progress of the current audio position", () => {
        const mockHowl = new Howl({ src: "foo" })
        const mockSeek = jest.spyOn(mockHowl, "seek")
        mockSeek.mockReturnValue(10)

        const { result } = renderHook(() => useAudioPosition(), {
            wrapper,
            initialProps: {
                children: null,
                value: {
                    player: mockHowl,
                    load: () => void {},
                    loading: false,
                    playing: false,
                    stopped: true,
                    error: null,
                    duration: 100,
                    ready: true,
                    ended: false
                }
            }
        })

        expect(result.current.percentComplete).toBe(10)
    })

    it("initializes position state from the audio source", () => {
        const mockHowl = new Howl({ src: "foo" })
        const mockSeek = jest.spyOn(mockHowl, "seek")
        mockSeek.mockReturnValue(90)

        const { result } = renderHook(() => useAudioPosition(), {
            wrapper,
            initialProps: {
                children: null,
                value: {
                    player: mockHowl,
                    load: () => void {},
                    loading: false,
                    playing: false,
                    stopped: true,
                    error: null,
                    duration: 100,
                    ready: true,
                    ended: false
                }
            }
        })

        expect(result.current.position).toBe(90)
    })

    it("tracks position of audio source every second", () => {
        jest.useFakeTimers()
        const mockHowl = new Howl({ src: "foo" })
        const mockSeek = jest.spyOn(mockHowl, "seek")
        mockSeek.mockReturnValue(0) // doesn't matter what value is mocked for this test case

        renderHook(() => useAudioPosition(), {
            wrapper,
            initialProps: {
                children: null,
                value: {
                    player: mockHowl,
                    load: () => void {},
                    loading: false,
                    playing: true,
                    stopped: true,
                    error: null,
                    duration: 100,
                    ready: true,
                    ended: false
                }
            }
        })

        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
        jest.useRealTimers()
    })
})
