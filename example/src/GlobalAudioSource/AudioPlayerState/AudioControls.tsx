import { FunctionComponent } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";

export const AudioControls: FunctionComponent<object> = () => {
  const { play, pause, stop, mute, muted, playing, loop, looping } =
    useGlobalAudioPlayer();

  return (
    <div>
      <button onClick={() => (playing ? pause() : play())}>
        {playing ? "pause" : "play"}
      </button>
      <button onClick={() => stop()}>stop</button>
      <button onClick={() => mute(!muted)}>toggle mute</button>
      <button onClick={() => loop(!looping)}>toggle loop</button>
    </div>
  );
};
