# react-use-audio-player

A custom React hook for controlling browser audio powered by the amazing [howler.js](https://howlerjs.com/) library. The intention of this package is to abstract away the details of howler's API using built-in React primitives to create an interface that is more React-friendly, allowing you to write React code that is free from audio-related side-effects.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
[![CircleCI](https://circleci.com/gh/E-Kuerschner/useAudioPlayer/tree/master.svg?style=shield)](https://app.circleci.com/github/E-Kuerschner/useAudioPlayer/pipelines?branch=master)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)

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
    const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
        src: file,
        format: "mp3",
        autoplay: false
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
The available options closely mirror howler's options but differ in some areas. 
    
- `src: string`
<br/> The path to an audio file
    
- `format?: string`
<br/> The format of the audio file. The format is infered from the file extension by default.
    
- `autoplay?: boolean`
<br/> Read more [here](https://github.com/goldfire/howler.js#autoplay-boolean-false)
    
- `html5?: boolean`
<br/> Read more [here](https://github.com/goldfire/howler.js#html5-boolean-false)
   
- `xhr?: Object`
<br/> Read more [here](https://github.com/goldfire/howler.js#xhr-object-null)
    
#### Return Value

`useAudioPlayer` returns a single object containing the following members:

-   `load: (config: object) => void`
    <br/>method to lazily load audio. It accepts the same configuration object that useAudioPlayer does.

-   `loading: boolean`
    <br/>true if audio is being fetched

-   `ready: boolean`
    <br/>true if the audio has been loaded and can be played

-   `playing: boolean`
    <br/>true is the audio is currently playing

-   `stopped: boolean`
    <br/>true if the audio has been stopped
    
-   `ended: boolean`
    <br/>is true once the currently loaded audio finishes playing. This will be unset if you begin playing again or load a new sound.

-   `error: Error`
    <br/>set when audio has failed to load

-   `play: () => void`
    <br/>plays the loaded audio

-   `pause: () => void`
    <br/>pauses the audio

-   `togglePlayPause: () => void`
    <br/>convenient equivalent to alternating calls to `play` and `pause`

-   `stop: () => void`
    <br/>stops the audio, returning the position to 0

-   `seek: (position: number) => number | undefined`
    <br/>sets the position of the audio to position (seconds)

-   `mute: () => void`
    <br/>mutes the audio
    
-   `volume: (value: number) => number`
    <br/>get/set the volume of the current sound. Volume values between 0.0 and 1.0

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
    const { position, duration } = useAudioPosition({ highRefreshRate: true })
    const [percent, setPercent] = React.useState(0)

    React.useEffect(() => {
        setPercent((position / duration) * 100 || 0)
    }, [position, duration])

    return <ProgressBar percentComplete={percent} />
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
    
-   `seek`
    <br/> For convenience the `seek` method from useAudioPlayer is also returned from this hook

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
