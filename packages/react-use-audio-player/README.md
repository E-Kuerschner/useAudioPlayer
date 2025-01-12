# react-use-audio-player

A custom React hook for keeping state in sync with your application's audio.
Built on top of the reliable [howler.js](https://howlerjs.com/) package.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
![CI](https://github.com/E-Kuerschner/useAudioPlayer/actions/workflows/CI.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

## Install

```bash
yarn add react-use-audio-player

npm install react-use-audio-player
```

## Getting Started

You want to add sound to your beautiful new React application; where do you start? From React's persective, audio is a _side effect_, meaning it does not live within nor affect the React component lifecycle.
This makes keeping your application's state in sync with your audio non-trivial.
Managing side-effects in React is tricky, but luckily with each major version of React, new APIs and techniques are added to make this task easier.
`react-use-audio-player` abtracts away all the complexities of keeping your React state in sync with your audio (in this case, [howler.js](https://howlerjs.com/) specifically).
For the curious-minded developer, this latest version of the package makes use of React's newer `useSyncExternalStore` hook to track the changes made to audio resources.

Below is an example of the simplest use case: requesting an audio resource and playing it once it finishes loading:

```tsx
import { useAudioPlayer } from "react-use-audio-player"

function PlayButton() {
    const { togglePlayPause, isPlaying } = useAudioPlayer("/mySong.wav", { autoplay: true })
    
    return <button onClick={togglePlayPause}>{ isPlaying ? "Pause" : "Play" }</button>
}
```

## Loading Audio Files

If you prefer a delcarative style, useAudioPlayer optionally accepts 2 arguments. 
This style is best suited for when you have several predetermined audio files that you need to switch between with state.
The first argument is the path or URL that will be used to load audio into the player.
When you change the value passed to this argument, the hook will stop and unload the current audio and immediately begin loading the new audio.

```tsx
const [songSrc, setSongSrc] = useState("/mySong.wav")

const { togglePlayPause } = useAudioPlayer(songSrc, { autoplay: true })
```

Altneratively, if you need a more imperative style, you may call useAudioPlayer without any arguments and invoke the retunred `load` method.
This lets you control precisesly when and where your audio file is requested.

```tsx
const { load, togglePlayPause } = useAudioPlayer()

// maybe after some user interaction
load("/mySound.wav", { autoplay: true })
```

For simplicity, both the hook itself and the load method implement the same interace.
Both approaches ultimately behave the same way so it is up to you to decide which model better meets the needs of your component.

### Load Parameters

```ts
type LoadParams = [src: string, options: AudioLoadOptions]

function load(...args: LoadParams): void
```

**src** `string` - a path or URL to your audio. When the value of `src` changes, the hook will begin loading the new resource with the `options` provided

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
// example:
useAudioPlayer("/mySong.wav", {
    initialVolume: 0.5,
    loop: true,
    autoplay: true,
    onend: () => {
        alert("the song has ended")
    }
})

// OR:
const { load } = useAudioPlayer()
load("/mySong.wav", {
    initialVolume: 0.5,
    loop: true,
    autoplay: true,
    onend: () => {
        alert("the song has ended")
    }
})
```

## AudioPlayer Interface

The `useAudioPlayer` hook returns an AudioPlayer object which includes many helpful properties and functions for building user interfaces with audio.

- **src** `string` The src of the current file loaded into the player
- **load** `(...args: LoadParams) => void` Loads a new audio file into the player. For load options and behavior see the **Load Params** section further up.
- **unload** `() => void` Stops the current audio if it's playing and deletes the resource from internal cache and references
- **play** `() => void` Begins or resumes playback of the audio.
- **pause** `() => void` Pauses the audio at its current playhead.
- **togglePlayPause** `() => void` Toggles between playing and pausing the audio.
- **stop** `() => void` Stops the audio and resets the playhead to the beginning (position 0).
- **setVolume** `(volume: number) => void` Sets the volume of the audio. Accepts a float between 0.1 and 1, where 1 is full volume.
- **setRate** `(rate: number) => void` Sets the playback rate of the audio. Accepts a float, where 1 is normal speed.
- **mute** `() => void` Mutes the audio.
- **unmute** `() => void` Unmutes the audio.
- **toggleMute** `() => void` Toggles between muted and unmuted states.
- **loopOn** `() => void` Enables looping of the audio upon completion.
- **loopOff** `() => void` Disables looping; the audio will stop upon completion.
- **toggleLoop** `() => void` Toggles between looping and non-looping behaviors.
- **fade** `(startVol: number, endVol: number, durationMs: number) => void` Fades the audio volume between a starting volume (startVol) and an ending volume (endVol) over the specified duration (durationMs) in milliseconds.
- **seek** `(position: number) => void` Moves the audio playhead to the specified position in seconds.
- **getPosition** `() => number` Returns the current position of the audio playhead in seconds.

The following fields will automatically update to stay in sync with the audio, triggering your component to rerender.
- **isUnloaded** `boolean` Indicates whether the audio is in an unloaded state.
- **isLoading** `boolean` Indicates whether the audio is currently loading.
- **isReady** `boolean` Indicates whether the audio is loaded and ready to play.
- **duration** `number` Represents the total duration of the audio in seconds. The value will be 0 until a sound is loaded.
- **rate** `number` The playback rate of the audio. A value of 1 indicates normal playback speed.
- **volume** `number` The volume level of the audio, typically between 0 (muted) and 1 (full volume).
- **error** `string | null` An error message, if an issue occurred with the audio.
- **isLooping** `boolean` Indicates whether the audio is set to loop after reaching its end.
- **isPaused** `boolean` Indicates whether the audio is currently paused.
- **isStopped** `boolean` Indicates whether the audio is currently stopped.
- **isPlaying** `boolean` Indicates whether the audio is currently playing.
- **isMuted** `boolean` Indicates whether the audio is currently muted.

## Demo Applications

To see full, realistic examples using the package check out the [demos](https://github.com/E-Kuerschner/useAudioPlayer/tree/main/demos).

At this time, these demos are not hosted anywhere, but you can run them locally in a few easy steps:

1. `git clone` the repo
2. `cd` into the project
2. `yarn install` from the root to install all dependencies
3. `yarn workspace showcase start` to start the _showcase_ demo

## Quick Recipes & Gotchas

cBelow are a few snippets to help with some of the trickier use-cases.

### Recipe: Pending states

The `isLoading`, `isReady`, or `isUnloaded` state properties can be used to present a pending UI to your users.

```tsx
const { isReady, isLoading, togglePlayPause } = useAudioPlayer('/mySong.wav', { autoplay: true })

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
