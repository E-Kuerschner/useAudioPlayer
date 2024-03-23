import { useEffect, useState } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { TimeLabel } from "../../TimeLabel";
import "./styles.css";

const songs = [
  "/ch_tunes - jam_10.wav",
  "/ch_tunes - baby_seal.wav",
  "/ch_tunes - jam_4.wav",
];

export function AutoPlayNextSound() {
  const [songIndex, setSongIndex] = useState(0);

  const { togglePlayPause, isReady, load, seek, duration, playing } =
    useGlobalAudioPlayer();

  useEffect(() => {
    load(songs[songIndex], {
      autoplay: true,
      onend: () => {
        setSongIndex((index) => {
          if (index === songs.length - 1) {
            return 0;
          }

          return index + 1;
        });
      },
    });
  }, [load, songIndex]);

  if (!isReady) return <h1>audio {songs[songIndex]} is loading</h1>;

  return (
    <div className="page autoPlayNextSound">
      <div className="autoPlayNextSound__player">
        <div className="trackList">
          <div className="trackList__title">Now playing...</div>
          {songs.map((s, i) => (
            <div
              key={s}
              className={`trackList__song${
                i === songIndex ? "--selected" : ""
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="autoPlayNextSound__controls">
          <button onClick={togglePlayPause}>
            {playing ? "pause" : "play"}
          </button>
          <button onClick={() => seek(duration * 0.99)}>skip to end</button>
        </div>
        <div>
          <TimeLabel />
        </div>
      </div>
    </div>
  );
}

export default AutoPlayNextSound;
