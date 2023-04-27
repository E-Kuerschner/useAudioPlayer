# react-use-audio-player

Typescript package exporting custom React hooks for controlling audio in the browser. Built on top of the amazing [howler.js](https://howlerjs.com/) library.

The intent of this package is to provide an idiomatic was to create and manipulate sounds in a React application.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
[![CircleCI](https://circleci.com/gh/E-Kuerschner/useAudioPlayer/tree/main.svg?style=shield)](https://app.circleci.com/pipelines/gh/E-Kuerschner/useAudioPlayer?branch=main)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

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
`useAudioPlayer` and `useGlobalAudioPlayer` share a lot of similarities. In fact, they return the same `AudioPlayer` interface.
Your use-case will determine which is the most appropriate for you to use.

`useGlobalAudioPlayer` has some unique functionality. It's purpose is to manage a single, global sound across your entire app. 
The inspiration for this came from a desire to easily build applications like SoundCloud or Spotify where no matter where you are in the app you can access and control the sound.
When you are using this hook you can call it from _anywhere_ in your component tree and it will synchronize with the same audio source as every other instance of useGlobalAudioPlayer.

For example, you could write a _Playlist_ component where clicking a track loads that song and begins playback. 
Then on a totally different branch in your component tree, write a _PlaybackControls_ component which calls useGlobalAudioPlayer and selects its _play_ and _pause_ members
to start and stop the same song previously loaded by _Playlist_.

To quickly decide if you should use useGlobalAudioPlayer, ask yourself these two questions:
1. **Does your app only need to play a single sound at a time?**
2. **Do you want to be able to control this sound from anywhere in your component tree?**
If the answer is yes to both of these, then useGlobalAudioPlayer is the right choice.

`useAudioPlayer` is the best choice for when you have a simple use-case. Each instance of the useAudioPlayer hook represents its own sound.
This means that you can load and play multiple sounds from the same component. 
For example, you could add separate, unique sound effects for the success and error responses of a fetch request.

TODO: The sound will stop when the hook unmounts

useGlobalAudioPlayer and useAudioPlayer can be used simultaneouly without one affecting the other.


## AudioPlayer (interface)

This is the interface returned from both useAudioPlayer and useGlobalAudioPlayer.
The interface provides all the state and methods listed below:

#### State
- loop: `boolean` (will the audio loop)
- isReady: `boolean` (is the sound loaded and ready to play)
- paused: `boolean` (is the sound paused)
- stopped: `boolean` (is the sound stopped)
- playing: `boolean` (is the sound playing)
- duration: `number` (the length in seconds)
- muted: `boolean` (is the sound muted)
- rate: `number` (the playback rate)
- volume: `number` (the volume level 0 - 1.0)
- error: `string` (error message if any after attemped load)

#### Methods
#### play (`() => void`)
> Plays the loaded sound. You must invoke this to start playback if `autoplay` was set to false

#### pause (`() => void`)
> Pauses the loaded sound.

#### togglePlayPause (`() => void`)
> Toggle play/pause state.

#### stop (`() => void`)
> Stops the loaded sounds and resets the position to 0.

#### mute (`(muted?: boolean) => void`)
> Mutes/unmutes the loaded sound.

#### setVolume (`(volume: number) => void`)
> Sets the volume level of the loaded audio. Accepts a floating point number between 0 and 1.0.

#### fade (`(from: number, to: number, duration: number) => void`)
> Fades the sounds volume level from the value of the first argument to the value of the second over a number of seconds defined by the final argument.

#### setRate (`(speed: number) => void`)
> Sets the playback speed of the loaded sound. Accepts a floating point value between 0.5 and 2.0.

#### seek (`(seconds: number) => void`)
> Sets the playback position of the loaded sound to the position passed in.

#### getPosition (`() => number`)
> Returns the current position of the loaded sound.

#### load (`(src: string, options?: AudioLoadOptions) => void`)
> Downloads/loads a new sound. The first argument is a URI of the sound to be downloaded. The second argument is a set of options.
> sdsflkjalskfj
> asdlfkjsd
> alksdjfldaskjf
> lakjsdflj
> ```tsx
> interface AudioLoadOptions
>
> Members:
>
> - loop (`boolean`)
> - autoplay (`boolean`)
> - initialVolume (`number`)
> - initialMute (`number`)
> - initialRate (`number`)
> - format (`string`)
> - html5 (`boolean`)
> - onstop (`() => void`)
> - onpause (`() => void`)
> - onload (`() => void`)
> - onend (`() => void`)
> - onplay (`() => void`)
>```



## Quick Recipes & Gotchas

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

### Recipe: Creating a seek bar

TODO

### Gotcha: Streaming audio

To stream or play large audio files, the audio player must be forced to use HTML5 as opposed to the Web Audio API which is Howler's default.
This is because the Web Audio API must download the entirety of the sound before playing.

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
