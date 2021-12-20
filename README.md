# react-use-audio-player
Custom React hooks for controlling audio in the browser powered by the amazing [howler.js](https://howlerjs.com/) library. 
The intention of this package is to provide an idiomatic way to use Howler in React while providing a simpler API via custom React hooks.
The currently available hooks allow you to set up an environment in which you can distribute the responsibility of managing a single audio source between different components in your React application. 

![Version](https://img.shields.io/npm/v/react-use-audio-player)
[![CircleCI](https://circleci.com/gh/E-Kuerschner/useAudioPlayer/tree/master.svg?style=shield)](https://app.circleci.com/github/E-Kuerschner/useAudioPlayer/pipelines?branch=master)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

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

This Provider is required for any of the hooks to function.
The Provider encapsulates a reference to a single audio source and all the state.
Besides the initial setup, you will never need to interact with the Provider directly.
The `useAudioPlayer` and `useAudioPosition` hooks give you an interface to do that.
The benefit of having a single, shared audio source is that it allows you to compose together multiple components that share knowledge about the audio.
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
    const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
        src: file,
        format: "mp3",
        autoplay: false,
        onend: () => console.log("sound has ended!")
    })

    if (!ready && !loading) return <div>No audio to play</div>
    if (loading) return <div>Loading audio</div>

    return (
        <div>
            <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
        </div>
    )
}
```

#### API

#### Arguments
`useAudioPlayer` optionally accepts some configuration as its only argument.
The options interface is identical to the [howler options](https://github.com/goldfire/howler.js#options).
    
#### Return Value

`useAudioPlayer` returns a single object containing the following members:

- `player`: [Howl](https://github.com/goldfire/howler.js/#methods)
    <br/>an escape hatch to access the underlying Howl object in case you need to use a howler feature which is not supported by this library's simplified API

- `load: (config: HowlOptions) => void`
    <br/>method to lazily load audio. It accepts the same configuration object as useAudioPlayer.
    <br/>once a sound has already been loaded, calling this method will not do anything unless the `src` property is different from the previously loaded sound

- `loading: boolean`
    <br/>true if audio is being fetched

- `ready: boolean`
    <br/>true if the audio has been loaded and can be played

- `playing: boolean`
    <br/>true is the audio is currently playing

- `stopped: boolean`
    <br/>true if the audio has been stopped
    
- `ended: boolean`
    <br/>is true once the currently loaded audio finishes playing. This will be unset if you begin playing again or load a new sound.

- `error: Error`
    <br/>set when audio has failed to load

- `play: () => void`
    <br/>plays the loaded audio

- `pause: () => void`
    <br/>pauses the audio

- `togglePlayPause: () => void`
    <br/>convenient equivalent to alternating calls to `play` and `pause`

- `stop: () => void`
    <br/>stops the audio, returning the position to 0

- `mute: () => void`
    <br/>mutes the audio
    
- `volume: (value: number) => number`
    <br/>get/set the volume of the current sound. Volume values between 0.0 and 1.0

- `fade: (start: number, end: number, duration: number) => Howl`
    <br/>fades the sound from volume _start_ to volume _end_ over _duration_ ms
<br/>

> #### useAudioPosition

This hooks exposes the current position and duration of the audio instance as its playing in real time.
This data may be useful when animating a visualization for your audio like a seek bar.
A separate hook was created to manage this state in order to avoid many rerenders of components that don't need the live data feed.
For example a component which renders a play/pause button may use `useAudioPlayer` but does not need to rerender every time the position of the playing audio changes.

```javascript
import React from "react"
import { useAudioPosition } from "react-use-audio-player"

const PlayBar = () => {
    const { percentComplete, duration, seek } = useAudioPosition({ highRefreshRate: true })
    
    const goToPosition = React.useCallback((percentage) => {
        seek(duration * percentage)
    }, [duration, seek])

    return <ProgressBar percentComplete={percentComplete} onBarPositionClick={goToPosition} />
}
```

#### API

#### Arguments
-   `(optional) config: { highRefreshRate: boolean }`
    <br/>`highRefreshRate` will allow useAudioPosition to update state at a smooth 60fps rate
    via the browser's requestAnimationFrame API. This is ideal for when you want smoother animations.

#### Return Value

`useAudioPosition` returns an object containing the following members:

-   `position: number`
    <br/>the current playback position of the audio in seconds

-   `duration: number`
    <br/>the total length of the audio in seconds

-   `percentComplete: number`
    <br/>the percentage of the duration the current position represents    
    
-   `seek: (position: number) => number`
    <br/>sets the position of the audio to position (seconds)

## Gotchas & Quick Gudies

### Guide: Switching sounds
Switching from one sound the next is a common use-case (i.e. a playlist queue). This can be done in a couple of different ways:

#### 1) calling #load in response to a user interaction
```tsx
const { load } = useAudioPlayer({
    src: songA,
    autoplay: true
})

const nextTrack = () => {
    load({
        src: songB,
        autoplay: true
    })
}

return <button onClick={nextTrack}>Start next track</button>
```

#### 2) updating the src property in the options object
```tsx
const songs = [songA, songB]
const [songIndex, setSongIndex] = useState(0)

const audioApi = useAudioPlayer({
    src: songs[songIndex],
    autoplay: true,
    onend: () => setSongIndex(songIndex + 1)
})
```

### Gotcha: Using event listeners
Unfortunately, due to the current implementation there are some not-so-clear restraints applied to the use of event listeners.

Currently, the options for `useAudioPlayer` matches the options for a [Howl object](https://github.com/goldfire/howler.js/#options) one-to-one, including all of Howler's event listeners.
However, setting the event listeners in the hook's options has some negative consequences when trying to invoke any of the hook's own methods which manipulate the audio (togglePlayPause, volume, fade, etc.).

Internally, those methods are memoized React callbacks with a dependency on the howler audio player object that is created when your sound loads. Initially, this player object is null.
Therefore, when trying to use one of the hook's own methods inside the option's event listeners, a stale reference to the player object will be captured (for more on this problem [check out this article](https://dmitripavlutin.com/react-hooks-stale-closures/))

For a recommended workaround, see the code snippet below:

```tsx
    const { fade } = useAudioPlayer({
        src: mySong,
        autoplay: true,
        onplay: () => {
            // BAD! Internally fade maintains a reference to player which is initially null
            // this will introduce a stale reference
            fade(0, 1, 5000)
        },
    });

    // BETTER! Guarantees that the latest reference to fade is used
    useEffect(() => {
        fade(0,1,5000)
    }, [fade])
```

### Gotcha: Streaming audio
In order for streamed audio content to work, make sure to force the audio source to use html5 and specify the format of the audio as shown below:

More information in this Howler [thread](https://github.com/goldfire/howler.js/issues/378)
```typescript jsx
const { pause } = useAudioPlayer({
    autoplay: true,
    src: "https://stream.toohotradio.net/128",
    html5: true,
    format: ["mp3"]
})
```

## Examples

To run the example applications follow the following steps:

1. `git clone` the repository
2. `cd useAudioPlayer/examples`
3. `yarn install`
4. `yarn start`
5. follow the local README for further assistance

## Release

The most basic npm release strategy is being followed for now. A good explanation can be found [here](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/).

Steps
1. commit work & tests
2. `yarn/npm version` (preversion script will ensure code is tested and built)
3. `yarn/npm publish`
4. `git push` & `git push --tags`
