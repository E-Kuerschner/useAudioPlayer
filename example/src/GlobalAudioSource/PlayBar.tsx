import { useGlobalAudioPlayer } from "react-use-audio-player";
import { AudioSeekBar } from "../AudioSeekBar";
import { TimeLabel } from "../TimeLabel";
import { VolumeControl } from "../VolumeControl";

export const PlayBar = () => {
  const { togglePlayPause, playing, isReady, setRate, rate, src } =
    useGlobalAudioPlayer();

  return (
    <div className="playBar">
      <div className="playBar__track">Track: {src}</div>
      <div className="playBar__mainControls">
        <button
          className="playBar__playButton"
          onClick={togglePlayPause}
          disabled={!isReady}
        >
          <i className={`fa ${playing ? "fa-pause" : "fa-play"}`} />
        </button>
        <div className="playBar__timeStuff">
          <AudioSeekBar className="playBar__seek" />
          <TimeLabel />
        </div>
      </div>
      <div>
        <div className="playBar__rateControl">
          <span>Playback Speed:</span>
          <select
            className="playBar__rateSelect"
            name="rateSelect"
            id="rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          >
            <option value="0.5">1/2x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <VolumeControl />
      </div>
    </div>
  );
};
