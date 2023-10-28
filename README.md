# react-use-audio-player

Typescript package exporting custom React hooks for controlling audio in the browser. Built on top of the amazing [howler.js](https://howlerjs.com/) library.

The intent of this package is to provide an idiomatic way to create and manipulate sounds in a React application.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
[![CircleCI](https://circleci.com/gh/E-Kuerschner/useAudioPlayer/tree/main.svg?style=shield)](https://app.circleci.com/pipelines/gh/E-Kuerschner/useAudioPlayer?branch=main)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

## [Version 2.0](https://github.com/E-Kuerschner/useAudioPlayer/discussions/106) Upgrade/Migration Guide

Note that v2 is a major upgrade and thus contains breaking changes for your applications. Overall the migration to v2 will involve you taking a few refactoring steps:

1. remove all uses of `useAudioPosition` and replace it with your own implementation (see the examples/recipes section below)
2. replace all uses of `useAudioPlayer` with `useGlobalAudioPlayer` which is exported from the v2 package (alongside a net-new hook using the old name of `useAudioPlayer` - more on that below)
3. check the docs for `useGlobalAudioPlayer` below since some API improvements have been made. Most notably, the hook is no longer called with any load arguments/options and instead returns an explicit `load` function that you must use.

## Install

```bash
yarn add react-use-audio-player
```

## Usage
To play a sound, import either `useAudioPlayer` or `useGlobalAudioPlayer` into a React component. Grab the `load` function from its return and get jamming!

```tsx
import { useGlobalAudioPlayer } from 'react-use-audio-player';

function MyComponent() {
  const { load } = useGlobalAudioPlayer();

  // ... later in a callback, effect, etc.
  load('/mySound.wav', {
    autoplay: true
  });
}
```

## Why Two Hooks?
`useAudioPlayer` and `useGlobalAudioPlayer` share a lot of similarities. In fact, they return the same `AudioPlayer` interface (see details below).
Your use-case will determine which hook is the most appropriate for you to use.

`useGlobalAudioPlayer` has some unique functionality. It's purpose is to manage a single, global sound across your entire app. 
The inspiration for this came from a desire to easily build applications like SoundCloud or Spotify where no matter where you are in the app you can access and control the sound.
When you are using this hook you can call it from _anywhere_ in your component tree and it will synchronize with the same audio source as every other instance of useGlobalAudioPlayer.

For example, you could write a _Playlist_ component where clicking a track loads that song and begins playback. 
Then, on a totally different branch in your component tree, write a _PlaybackControls_ component which calls useGlobalAudioPlayer and uses its _play_ and _pause_ members
to start and stop the same song previously loaded by _Playlist_.

To quickly determine if useGlobalAudioPlayer is right for you, ask yourself these two questions:
1. **Does your app only need to play a single sound at any given time?**
2. **Do you want to be able to control this sound from anywhere in your component tree?**
If the answer is yes to both of these questions, then useGlobalAudioPlayer is the right choice for your application.

`useAudioPlayer` is the best choice for when you have a simple use-case. Each instance of the useAudioPlayer hook represents its own sound.
This means that you can load and play multiple sounds from the same component. 
For example, you could add separate, unique sound effects for the success and error responses of a fetch request.

**Note:** Unlike useGlobalAudioPlayer, useAudioPlayer returns an additional method for cleaning up audio if you wish to stop playing and destroy the sound after some interaction (i.e. component unmount, user navigates to a different route, etc.). 
Without cleaning up, sounds may live on even after the components that created them unmount possibly leading to memory leaks.

useGlobalAudioPlayer and useAudioPlayer can be used simultaneously without one affecting the other.


## AudioPlayer (interface)

This is the interface implemented by the returned object of both _useAudioPlayer_ and _useGlobalAudioPlayer_.
The interface defines all the state for a sound and a set of methods to manipulate the state/sound.

#### State
- src: `string` (the src used to load the audio)
- looping: `boolean` (is the audio looping)
- isReady: `boolean` (is the sound loaded and ready to play)
- paused: `boolean` (is the sound paused)
- stopped: `boolean` (is the sound stopped i.e. not playing & position 0)
- playing: `boolean` (is the sound playing)
- duration: `number` (the length in seconds)
- muted: `boolean` (is the sound muted)
- rate: `number` (the playback rate)
- volume: `number` (the volume level 0 - 1.0)
- error: `string |  null` (error message if any, after attempted load)

#### Methods
#### play `() => void`
Plays the loaded sound. You must invoke this to start playback if `autoplay` was set to false

#### pause `() => void`
Pauses the playing sound

#### togglePlayPause `() => void`
Toggles the play/pause state

#### stop `() => void`
Stops the playing sound and resets the position to 0.

#### setVolume `(volume: number) => void`
Sets the volume level of the loaded audio. Accepts a floating point number between 0 and 1.0 (muted to loudest)

#### mute `(muteOnOff: boolean) => void`
Mutes/unmutes the loaded sound

#### fade `(from: number, to: number, duration: number) => void`
Fades the sound's volume level from the value of the first argument to the value of the second, over a number of milliseconds as set by the final argument

#### setRate `(speed: number) => void`
Sets the playback speed of the loaded sound. Accepts a floating point value between 0.5 and 2.0. Currently half speed is the slowest and double is the fastest supported rates

#### seek `(position: number) => void`
Sets the playback position of the loaded sound to the argument. The position argument is floating point number representing the time the audio should move to

#### loop `(loopOnOff: boolean) => void`
Sets or unsets whether the sound should loop once it ends

#### getPosition `() => number`
Returns the current position of the loaded sound as a floating point number

#### load `(src: string, options?: AudioLoadOptions) => void`
Downloads and loads a new sound. The first argument, src is a URI of the sound to be played. The second argument is a set of options applied to the sound once it loads.
These options can be used to initialize certain pieces of state on the `AudioPlayer` interface or be used to set up lifecycle callbacks if needed.

`AudioLoadOptions`
- loop?: boolean (sets the initial loop state once the sound loads)
- autoplay?: boolean (sets if the sound will automatically begin playing after load)
- initialVolume?: number (sets the initial volume level once the sound loads)
- initialMute?: number (sets the initial mute state once the sound loads)
- initialRate?: number (sets the initial playback rate once the sound loads)
- format?: string (sets the format of the loaded sound - should be set if your URI does not contain an extension)
- html5?: boolean (loads the sound in an HTML5 audio tag as opposed to using the Web Audio API)
- onplay?: () => void (callback for when audio begins playing)
- onstop?: () => void (callback for when audio is stopped)
- onpause?: () => void (callback for when audio is paused)
- onload?: () => void (callback for when audio finishes loading)
- onend?: () => void (callback for when audio has reached its end)


## Quick Recipes & Gotchas
For full, example applications see the [runnable examples](https://github.com/E-Kuerschner/useAudioPlayer/tree/main/examples) in the repo.
Below are a few snippets to help with some of the trickier use-cases.

### Recipe: Switching between sounds on a single audio player

Switching from one sound the next is a common use-case (i.e. a playlist queue). This can be done in a couple of different ways:

```tsx
// the same solution will work with useGlobalAudioPlayer
const { load } = useAudioPlayer();

const nextTrack = () => {
  load(nextSong, { autoPlay: true });
};

return <button onClick={nextTrack}>Start next track</button>;
```

Alternatively, you can queue up the next song to play when the current sound ends. You can see a full, working example of this in the `AutoPlayNextSong` component in /examples.

```tsx
const songs = [songA, songB];
const [songIndex, setSongIndex] = useState(0);

const { load } = useAudioPlayer();

useEffect(() => {
  load(songs[songIndex], {
    autoplay: true,
    onend: () => setSongIndex(songIndex + 1)
  });
}, [songIndex, load]);
```

### Recipe: Syncing React state to live audio position

In previous 1.x versions of the library, a separate hook was exported from the package which tracked state representing the current seek time of a playing sound.
While this was helpful it ultimately fell outside the scope of the hook as the v2 rewrite took shape.
This is mainly due to the difficulty of supporting the feature for both forms of the hook useAudioPlayer/useGlobalAudioPlayer.

Luckily, even without a dedicated hook, it is trivial to implement the same functionality yourself. Below is one method for how you might write your own hook for tracking seek time.

```tsx
function useAudioTime() {
    const frameRef = useRef<number>()
    const [pos, setPos] = useState(0)
    const { getPosition } = useGlobalAudioPlayer()
    
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
    
    return pos;
}
```

### Gotcha: Streaming audio

To stream or play large audio files, the audio player must be forced to use HTML5 as opposed to the Web Audio API which is Howler's default.
This is because the Web Audio API must download the entirety of the sound before playing anything.

When streaming or working with large files make sure to use the `html5` option of the `#load` function.

Also, if your sound _src_ string does not contain an extension (like if you are fetching a stream from an API), be sure to set it with the `format` option of the `#load` function.

More information in this Howler [thread](https://github.com/goldfire/howler.js/issues/378)

```typescript jsx
const { load } = useAudioPlayer();

load('https://stream.toohotradio.net/128', {
  autoplay: true,
  html5: true,
  format: 'mp3'
});
```

## Examples

Eventually I would like to host & run the examples somewhere on the web, but for now to run them yourself locally, follow the following steps:

1. `git clone` the repository
2. `cd useAudioPlayer/examples`
3. `yarn install`
4. `yarn start`
5. follow the local README for further assistance

## Contributing

Please consider opening an Issue or Pull Request on the Github and I will do my best to respond to these in a timely manner.

## Release

The most basic npm release strategy is being followed for now. A good explanation can be found [here](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/).

Steps

1. commit work & tests
2. `yarn/npm version` (preversion script will ensure code is tested and built)
3. `yarn/npm publish`
4. `git push` & `git push --tags`
