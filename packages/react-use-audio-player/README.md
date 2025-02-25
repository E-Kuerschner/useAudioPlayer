# react-use-audio-player

A custom React hook for keeping state in sync with audio. Built on top of the reliable [howler.js](https://howlerjs.com/) package.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
![CI](https://github.com/E-Kuerschner/useAudioPlayer/actions/workflows/CI.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

## Install

```bash
yarn add react-use-audio-player

npm install react-use-audio-player
```

## Contents

1. #### [Intro](#intro)
2. #### [useAudioPlayer](#useaudioplayer)
3. #### [useAudioPlayerContext](#useaudioplayercontext--audioplayerprovider)
4. #### [_AudioPlayer API_](#audioplayer-interface)
5. #### [Running Demos](#demo-applications)
6. #### [Short Guides](#quick-recipes--gotchas)

## Intro

You want to add sound to your beautiful new React application; where do you start? From React's perspective, audio is a _side effect_,
meaning it does not live within nor affect the component lifecycle. This makes keeping your application state in sync with audio a non-trivial task.
`react-use-audio-player` handles of that state synchronization for you, so you can focus on more important things!
For the curious-minded developer, this latest version of the package makes use of React's newer `useSyncExternalStore` to synchronize the audio and state.

Below is an example of the simplest use case: requesting an audio resource and playing it once it finishes loading:

```tsx
import { useAudioPlayer } from "react-use-audio-player"

function PlayButton() {
    const { togglePlayPause, isPlaying } = useAudioPlayer("/mySong.wav", {
        autoplay: true
    })

    return (
        <button onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
        </button>
    )
}
```

---

## useAudioPlayer

`useAudioPlayer` returns a new instance of an [AudioPlayer](#audioplayer-interface).
This hook is particularly suited for **basic use cases** involving a single, or a small number of components.
The behavior of the hook is scoped to the component in which it is rendered, meaning when that component unmounts,
the associated audio resource is automatically stopped and cleaned up.

### Example

Whatever your use case, it will likely require fetching an audio file from your server or from the internet. 
In react-use-audio-player, this can be done with the [AudioPlayer](#audioplayer-interface)'s `load` method.
This function accepts a URL to the audio resource and a set of options which can alter the loading behavior and set initial state for the player.
For specific details on loading audio resources, visit the [Loading Audio](#loading-audio) section. 

```tsx
import { useAudioPlayer } from "react-use-audio-player"

function Example() {
    const { load } = useAudioPlayer()

    const handleStart = () => {
        load("/mySong.mp3", {
            initialVolume: 0.75,
            autoplay: true,
        })
    }

    return <button onClick={handleStart}>Start</button>
}
```

### Optional Parameters

`useAudioPlayer` optionally accepts the _same_ arguments as the `load` function for a more declarative programming style.
This approach is useful when you know the audio resource upfront and want to specify it inline with the hook.
When invoked this way, useAudioPlayer with not return the `load` method used in the previous example in order to prevent mixing the two approaches.

Do note, that when changing the URL parameter (maybe using React state), the AudioPlayer will immediately stop the current audio and begin loading the new resource.
This behavior is equivalent to subsequent calls the `load` function used when useAudioPlayer is called without any arguments.

### Example

```tsx
import { useAudioPlayer } from "react-use-audio-player"

function Example() {
    const { togglePlayPause, isPlaying } = useAudioPlayer("/mySong.mp3", {
        autoplay: false,
        loop: false
    })

    return (
        <button onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
        </button>
    )
}
```

---

## useAudioPlayerContext & AudioPlayerProvider

`useAudioPlayerContext` returns a shared instance of an [AudioPlayer](#audioplayer-interface).
It's designed to provide access to a shared audio resource across multiple components within your application. 
This is made possible by wrapping your component tree with the `AudioPlayerProvider` component.

### When to Use

When you need to control a **single audio source** across many components, `useAudioPlayerContext` is ideal. It ensures
that all components can share the same audio source, state, and API.

### How to Use

To start using `useAudioPlayerContext`, wrap the root of your React component tree (or a specific subtree where shared
audio control is desired) with the `AudioPlayerProvider`. Then, any child component within this provider can call
`useAudioPlayerContext` to access the shared instance of an [AudioPlayer](#audioplayer-interface).

### Example Usage

```tsx
// PlayPauseButton.tsx
function PlayPauseButton() {
    const { togglePlayPause, isPlaying } = useAudioPlayerContext()

    return (
        <button onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
        </button>
    )
}

// VolumeControl.tsx
function VolumeControl() {
    const { setVolume } = useAudioPlayerContext()

    return (
        <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
    )
}

// App.tsx
function App() {
    return (
        <AudioPlayerProvider>
            <PlayPauseButton />
            <VolumeControl />
        </AudioPlayerProvider>
    )
}
```

---

## _AudioPlayer_ Interface

An _AudioPlayer_ is the object returned from both [`useAudioPlayer`](#useaudioplayer) and [useAudioPlayerContext](#useaudioplayercontext--audioplayerprovider).
It contains the current state of the audio, an API for controlling it, as well as an escape hatch for accessing the underlying Howl object for when it is needed.

### State

Use these properties to build a UI that stays in sync with your audio.

- **src** `string` The src of the current file loaded into the player
- **isUnloaded** `boolean` Indicates whether the audio is in an unloaded state.
- **isLoading** `boolean` Indicates whether the audio is currently loading.
- **isReady** `boolean` Indicates whether the audio is loaded and ready to play.
- **duration** `number` Represents the total duration of the audio in seconds. The value will be 0 until a sound is loaded.
- **isPlaying** `boolean` Indicates whether the audio is currently playing.
- **isPaused** `boolean` Indicates whether the audio is currently paused.
- **isStopped** `boolean` Indicates whether the audio is currently stopped.
- **volume** `number` The volume level of the audio, typically between 0 (muted) and 1 (full volume).
- **isMuted** `boolean` Indicates whether the audio is currently muted.
- **rate** `number` The playback rate of the audio. A value of 1 indicates normal playback speed.
- **isLooping** `boolean` Indicates whether the audio is set to loop after reaching its end.
- **error** `string | null` An error message, if an issue occurred with the audio.

### Audio Controls API

The following methods can be used to manipulate the audio and my trigger a rerender of your component if it causes any of the state above to change.

- **load** `(...args: LoadParams) => void` Loads a new audio file into the player. For load options and behavior see the **Load Params** section further up.
- **unload** `() => void` Stops the current audio if it's playing and deletes the resource from internal cache and references
- **seek** `(position: number) => void` Moves the audio playhead to the specified position in seconds.
- **getPosition** `() => number` Returns the current position of the audio playhead in seconds.
- **play** `() => void` Begins or resumes playback of the audio.
- **pause** `() => void` Pauses the audio at its current playhead.
- **togglePlayPause** `() => void` Toggles between playing and pausing the audio.
- **stop** `() => void` Stops the audio and resets the playhead to the beginning (position 0).
- **setVolume** `(volume: number) => void` Sets the volume of the audio. Accepts a float between 0.1 and 1, where 1 is full volume.
- **mute** `() => void` Mutes the audio.
- **unmute** `() => void` Unmutes the audio.
- **toggleMute** `() => void` Toggles between muted and unmuted states.
- **setRate** `(rate: number) => void` Sets the playback rate of the audio. Accepts a float, where 1 is normal speed.
- **loopOn** `() => void` Enables looping of the audio upon completion.
- **loopOff** `() => void` Disables looping; the audio will stop upon completion.
- **toggleLoop** `() => void` Toggles between looping and non-looping behaviors.
- **fade** `(startVol: number, endVol: number, durationMs: number) => void` Fades the audio volume between a starting volume (startVol) and an ending volume (endVol) over the specified duration (durationMs) in milliseconds.

---

## Loading Audio

Fetching an audio file can be done by either calling the `load` method of the `AudioPlayer` or by optionally passing the same arguments to the [`useAudioPlayer`](#optional-parameters) hook.
Both approaches to loading audio utilize the same parameters:

### Load Parameters

```ts
type LoadParams = [src: string, options?: AudioLoadOptions]
```

**src** `string` - URL to your audio file.

**options** `AudioLoadOptions` - (all options are ...wait for it... 🥁 _optional_):

- **autoplay** `boolean` Defaults to `false`. Sets if the sound will automatically begin playing after load)
- **loop** `boolean` Defaults to `false`. sets whether the sound should loop after it finishes playing
- **format** `string` Sets the audio format if the URI does not contain an extension (e.g., 'mp3', 'wav')
- **html5** `boolean` Defaults to `false`. Forces the use of HTML5 audio instead of the Web Audio API
- **initialVolume** `number` Defaults to `1`. Sets the initial volume level once the sound loads (range: 0 to 1.0)
- **initialMute** `boolean` Defaults to `false`. Sets whether the sound should be muted initially
- **initialRate** `number` Defaults to `1`. Sets the initial playback rate once the sound loads
- **onplay** `() => void` callback executed when audio begins playing
- **onstop** `() => void` callback executed when audio is stopped
- **onpause** `() => void` callback executed when audio is paused
- **onload** `() => void` callback executed when audio finishes loading
- **onend** `() => void` callback executed when audio has reached its end

```tsx
// example loading from useAudioPlayer directly
useAudioPlayer("/mySong.wav", {
    initialVolume: 0.5,
    loop: true,
    autoplay: true,
    onend: () => {
        alert("the song has ended")
    }
})

// example loading using the load method from an AudioPlayer object
const { load } = useAudioPlayerContext() // could be useAudioPlayer as well
load("/mySong.wav", {
    initialVolume: 0.5,
    loop: true,
    autoplay: true,
    onend: () => {
        alert("the song has ended")
    }
})
```

---

## Demo Applications

To see full, realistic examples using the package check out the [demos](https://github.com/E-Kuerschner/useAudioPlayer/tree/main/demos).

At this time, these demos are not hosted anywhere, but you can run them locally in a few easy steps:

1. `git clone` the repo
2. `cd` into the project
3. `yarn install` from the root to install all dependencies
4. `yarn workspace showcase start` to start the _showcase_ demo

---

## Quick Recipes & Gotchas

Below are a few snippets to help with some of the trickier use-cases.

### Recipe: Pending states

The `isLoading`, `isReady`, or `isUnloaded` state properties can be used to present a pending UI to your users.

```tsx
const { isReady, isLoading, togglePlayPause } = useAudioPlayer("/mySong.wav", {
    autoplay: true
})

return isLoading ? (
    <LoadingSpinner />
) : (
    <PlayButton disabled={!isReady} onClick={togglePlayPause} />
)
```

### Recipe: Tracking the current audio playhead

Below is an example of how you might write a custom hook that keeps state for the current playhead position of the audio.

```tsx
function useAudioTime() {
    const frameRef = useRef<number>()
    const [pos, setPos] = useState(0)
    const { getPosition } = useAudioPlayer("/mySong.wav", { autoplay: true })

    useEffect(() => {
        const animate = () => {
            setPos(getPosition())
            frameRef.current = requestAnimationFrame(animate)
        }

        frameRef.current = window.requestAnimationFrame(animate)

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
        }
    }, [getPosition])

    return pos
}
```

### Gotcha: Streaming audio

To stream or play large audio files, the audio player must be forced to use an HTML5 `<audio>` as opposed to the Web Audio API which is Howler's default.
This is mainly because the Web Audio API must download the entirety of the sound it can play anything.

Also, if your sound _src_ string does not contain an extension (like if you are fetching a stream from an API), be sure to set it with the `format` option of the `#load` function.

More information in this Howler [thread](https://github.com/goldfire/howler.js/issues/378)

```tsx
const { load } = useAudioPlayer()

load("https://stream.toohotradio.net/128", {
    autoplay: true,
    html5: true,
    format: "mp3"
})
```

### Recipe: Howl escape hatch

The goal of this hook was always to provide an idiomatic _React_ way of maintaining state synced to an audio file.
To remain focused on that goal, not every Howler API has been supported completely (spatial and sprite features for example).

If you believe this package should support these features please feel free to open a feature request in GitHub with your justification. I am always happy to discuss and collaborate.

For anything that this package does not support, an _escape hatch_ is available via the `player` object returned from the hook. The player is the underlying `Howl` instance that is being managed by the hook.

Be warned that certain operations performed directly through the `Howl` API may cause the state to desynchronize from the audio.

```tsx
const { player } = useAudioPlayer()

player.once("seek", () => {
    console.log("I just seeked!")
})
```
