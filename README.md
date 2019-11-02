# react-use-audio-player

A custom React hook for controlling browser audio playback

![Version](https://img.shields.io/npm/v/react-use-audio-player)

## Setup

Install with `npm` or `yarn`

```bash
npm install react-use-audio-player
```

```bash
yarn add react-use-audio-player
```

## Usage

This library exports a context Provider and two hooks for managing the audio instance and consuming its state.

#### \<AudioPlayerProvider>

This Provider is required for the hooks to function.
The Provider manages an audio instance and exposes an interface for manipulating the audio through the API of the hooks.

```javascript
import React from "react"
import { AudioPlayerProvider } from "react-use-audio-player"

const App = () => {
    return (
        <AudioPlayerProvider>
            <AudioPlayer audio="meow.mp3" />
        </AudioPlayerProvider>
    )
}
```

#### useAudioPlayer

This is the main hook for controlling your audio instance.

Example:

```javascript
import React from "react"
import { useAudioPlayer } from "react-use-audio-player"

const AudioPlayer = ({ audio }) => {
    const { play, pause, playbackReady, loading, isPlaying } = useAudioPlayer(
        audio
    )

    const togglePlay = () => {
        if (isPlaying()) {
            pause()
        } else {
            play()
        }
    }

    if (!playbackReady && !loading) return <div>No audio to play</div>
    if (loading) return <div>Loading audio</div>

    return (
        <div>
            <button onClick={togglePlay}>
                {isPlaying() ? "Pause" : "Play"}
            </button>
        </div>
    )
}
```

##### API

#### `loading: boolean`

true if audio is being fetched

#### `playbackReady: boolean`

true if the audio has been loaded and can be played

#### `error: Error`

set when audio has failed to load

#### `play: function`

plays the loaded audio

#### `pause: function`

pauses audio

#### `stop: function`

stops the audio, returning the position to 0

#### `loadAudio: function(url: string)`

loads an audio file

#### `isPlaying: function: boolean`

true is the audio is currently playing

#### `seek: function(position: number)`

sets the position of the audio to position (seconds)

#### `mute: function`

mutes the audio

#### useAudioPosition

This hooks exposes the current position and duration of the audio instance as its playing in real time (60 fps via [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)).
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

## Contributing

Please submit pull requests to the repository.

#### Eslint

A basic eslint configuration has been set up but should be expanded with more rules.

#### Prettier

Code style and formatting is handled by [Prettier](https://prettier.io/).
The formatter will run pre-commit to ensure consistent style between contributers.
