# react-use-audio-player

A custom React hook for controlling browser audio playback

![Version](https://img.shields.io/npm/v/react-use-audio-player)

## Install

```bash
yarn add react-use-audio-player
```

## TypeScript

For convenience, the library's type definitions are included in the package under `index.d.ts`.

## Usage

This library exports a context Provider and two hooks for controlling an audio source, giving you the tools you need to build you own audio player or visualization.

<br/>

> #### AudioPlayerProvider

This Provider is required for the hooks to function.
The Provider contains a single audio source and exposes an interface for manipulating it via the `useAudioPlayer` hook.
The benefit of having a single, shared audio source is that it allows the developer to compose together multiple components that share knowledge about the audio.
For example, you may have separate components `PlayPauseButton`, `SeekBar` and `VolumeControls` all working together on the same audio source.

```javascript
import React from "react"
import { AudioPlayerProvider } from "react-use-audio-player"

const App = () => {
    return (
        <AudioPlayerProvider>
            <AudioPlayer file="meow.mp3" />
        </AudioPlayerProvider>
    )
}
```

<br/>

> #### useAudioPlayer

This is the main hook for controlling your audio instance.

Example:

```javascript
import React from "react"
import { useAudioPlayer } from "react-use-audio-player"

const AudioPlayer = ({ file }) => {
    const { play, pause, ready, loading, playing } = useAudioPlayer({
        src: file,
        format: "mp3",
        autoplay: false
    })

    const togglePlay = () => {
        if (playing) {
            pause()
        } else {
            play()
        }
    }

    if (!ready && !loading) return <div>No audio to play</div>
    if (loading) return <div>Loading audio</div>

    return (
        <div>
            <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
        </div>
    )
}
```

#### API

#### Arguments

-   `audioPlayerConfig: { src: string, format?: string, autoplay?: boolean }`
    <br/>`autoplay` and `format` are optional. `autoplay` will default to false.

#### Return Value

`useAudioPlayer` returns a single object containing the following members:

-   `loading: boolean`
    <br/>true if audio is being fetched

-   `ready: boolean`
    <br/>true if the audio has been loaded and can be played

-   `playing: boolean`
    <br/>true is the audio is currently playing

-   `stopped: boolean`
    <br/>true if the audio has been stopped

-   `error: Error`
    <br/>set when audio has failed to load

-   `play: () => void`
    <br/>plays the loaded audio

-   `pause: () => void`
    <br/>pauses the audio

-   `stop: () => void`
    <br/>stops the audio, returning the position to 0

-   `seek: (position: number) => void`
    <br/>sets the position of the audio to position (seconds)

-   `mute: () => void`
    <br/>mutes the audio

<br/>

> #### useAudioPosition

This hooks exposes the current position and duration of the audio instance as its playing in real time.
This data may be useful when animating a visualization for your audio like a seek bar.
A separate hook was created to manage this state in order to avoid many rerenders of components that don't need the live data feed.
For example a component that renders a play/pause button may use `useAudioPlayer` but does not need to rerender every time the position of the playing audio changes.

```javascript
import React from "react"
import { useAudioPosition } from "react-use-audio-player"

const PlayBar = () => {
    const { position, duration } = useAudioPosition()
    const [percent, setPercent] = React.useState(0)

    React.useEffect(() => {
        setPercent((position / duration) * 100 || 0)
    }, [position, duration])

    return <ProgressBar percentComplete={percent} />
}
```

#### API

#### Return Value

`useAudioPosition` returns an object containing the following members:

-   `position: number`
    <br/>the current playback position of the audio in seconds

-   `duration: number`
    <br/>the total length of the audio in seconds

## Examples

To run the example applications follow the following steps:

1. `git clone` the repository
2. `cd useAudioPlayer/examples`
3. `yarn install`
4. `yarn start`
5. follow the local README for further assistance

## Development Tools

#### Eslint

A basic eslint configuration has been set up but should be expanded with more rules.

#### Prettier

Code style and formatting is handled by [Prettier](https://prettier.io/).
The formatter will run pre-commit to ensure consistent style between contributers.
