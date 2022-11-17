import React, { useState, useReducer, useRef, useMemo, useCallback, useEffect, useContext, useLayoutEffect } from 'react';
import { Howl } from 'howler';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var Actions;

(function (Actions) {
  Actions[Actions["START_LOAD"] = 0] = "START_LOAD";
  Actions[Actions["ON_LOAD"] = 1] = "ON_LOAD";
  Actions[Actions["ON_PLAY"] = 2] = "ON_PLAY";
  Actions[Actions["ON_END"] = 3] = "ON_END";
  Actions[Actions["ON_PAUSE"] = 4] = "ON_PAUSE";
  Actions[Actions["ON_STOP"] = 5] = "ON_STOP";
  Actions[Actions["ON_PLAY_ERROR"] = 6] = "ON_PLAY_ERROR";
  Actions[Actions["ON_LOAD_ERROR"] = 7] = "ON_LOAD_ERROR";
})(Actions || (Actions = {}));

var initialState = {
  loading: true,
  playing: false,
  stopped: true,
  ended: false,
  error: null,
  duration: 0,
  ready: false
};
function reducer(state, action) {
  switch (action.type) {
    case Actions.START_LOAD:
      return _extends({}, state, {
        loading: true,
        stopped: true,
        ready: false,
        error: null,
        duration: 0
      });

    case Actions.ON_LOAD:
      return _extends({}, state, {
        loading: false,
        duration: action.duration,
        ended: false,
        ready: true
      });

    case Actions.ON_PLAY:
      return _extends({}, state, {
        playing: true,
        ended: false,
        stopped: false
      });

    case Actions.ON_STOP:
      return _extends({}, state, {
        stopped: true,
        playing: false
      });

    case Actions.ON_END:
      return _extends({}, state, {
        stopped: true,
        playing: false,
        ended: true
      });

    case Actions.ON_PAUSE:
      return _extends({}, state, {
        playing: false
      });

    case Actions.ON_PLAY_ERROR:
      return _extends({}, state, {
        playing: false,
        stopped: true,
        error: action.error
      });

    case Actions.ON_LOAD_ERROR:
      return _extends({}, state, {
        playing: false,
        stopped: true,
        loading: false,
        error: action.error
      });

    default:
      return state;
  }
}

var playerContext = /*#__PURE__*/React.createContext(null);
var positionContext = /*#__PURE__*/React.createContext({
  position: 0,
  setPosition: function setPosition() {}
});

function AudioPlayerProvider(_ref) {
  var children = _ref.children,
      value = _ref.value;

  var _useState = useState(null),
      player = _useState[0],
      setPlayer = _useState[1];

  var _useReducer = useReducer(reducer, initialState),
      _useReducer$ = _useReducer[0],
      loading = _useReducer$.loading,
      error = _useReducer$.error,
      playing = _useReducer$.playing,
      stopped = _useReducer$.stopped,
      duration = _useReducer$.duration,
      ready = _useReducer$.ready,
      ended = _useReducer$.ended,
      dispatch = _useReducer[1];

  var playerRef = useRef();
  var prevPlayer = useRef();

  var _useState2 = useState(0),
      position = _useState2[0],
      setPosition = _useState2[1];

  var positionContextValue = useMemo(function () {
    return {
      position: position,
      setPosition: setPosition
    };
  }, [position, setPosition]);
  var constructHowl = useCallback(function (audioProps) {
    return new Howl(audioProps);
  }, []);
  var load = useCallback(function (_ref2) {
    var src = _ref2.src,
        _ref2$autoplay = _ref2.autoplay,
        autoplay = _ref2$autoplay === void 0 ? false : _ref2$autoplay,
        _ref2$html = _ref2.html5,
        html5 = _ref2$html === void 0 ? false : _ref2$html,
        rest = _objectWithoutPropertiesLoose(_ref2, ["src", "autoplay", "html5"]);

    var wasPlaying = false;

    if (playerRef.current) {
      // don't do anything if we're asked to reload the same source
      // @ts-ignore the _src argument actually exists
      var _src = playerRef.current._src; // internal Howl _src property is sometimes an array and other times a single string
      // still need to to do more research on why this is

      var prevSrc = Array.isArray(_src) ? _src[0] : _src;
      if (prevSrc === src) return; // if the previous sound is still loading then destroy it as soon as it finishes

      if (loading) {
        prevPlayer.current = playerRef.current;
        prevPlayer.current.once("load", function () {
          var _prevPlayer$current;

          (_prevPlayer$current = prevPlayer.current) === null || _prevPlayer$current === void 0 ? void 0 : _prevPlayer$current.unload();
        });
      } else {
        var _prevPlayer$current2;

        prevPlayer.current = playerRef.current;
        (_prevPlayer$current2 = prevPlayer.current) === null || _prevPlayer$current2 === void 0 ? void 0 : _prevPlayer$current2.unload();
      }

      wasPlaying = playerRef.current.playing();

      if (wasPlaying) {
        playerRef.current.stop(); // remove event handlers from player that is about to be replaced

        playerRef.current.off();
        playerRef.current = undefined;
      }
    } // signal that the loading process has begun


    dispatch({
      type: Actions.START_LOAD
    }); // create a new player

    var howl = constructHowl(_extends({
      src: src,
      autoplay: wasPlaying || autoplay,
      html5: html5
    }, rest)); // if this howl has already been loaded (cached) then fire the load action
    // @ts-ignore _state exists

    if (howl._state === "loaded") {
      dispatch({
        type: Actions.ON_LOAD,
        duration: howl.duration()
      });
    }

    howl.on("load", function () {
      return void dispatch({
        type: Actions.ON_LOAD,
        duration: howl.duration()
      });
    });
    howl.on("play", function () {
      return void dispatch({
        type: Actions.ON_PLAY
      });
    });
    howl.on("end", function () {
      return void dispatch({
        type: Actions.ON_END
      });
    });
    howl.on("pause", function () {
      return void dispatch({
        type: Actions.ON_PAUSE
      });
    });
    howl.on("stop", function () {
      return void dispatch({
        type: Actions.ON_STOP
      });
    });
    howl.on("playerror", function (_id, error) {
      dispatch({
        type: Actions.ON_PLAY_ERROR,
        error: new Error("[Play error] " + error)
      });
    });
    howl.on("loaderror", function (_id, error) {
      dispatch({
        type: Actions.ON_LOAD_ERROR,
        error: new Error("[Load error] " + error)
      });
    });
    setPlayer(howl);
    playerRef.current = howl;
  }, [constructHowl, loading]);
  useEffect(function () {
    // unload the player on unmount
    return function () {
      if (playerRef.current) playerRef.current.unload();
    };
  }, []);
  var contextValue = useMemo(function () {
    return value ? value : {
      player: player,
      load: load,
      error: error,
      loading: loading,
      playing: playing,
      stopped: stopped,
      ready: ready,
      duration: duration,
      ended: ended
    };
  }, [loading, error, playing, stopped, load, value, player, ready, duration, ended]);
  return React.createElement(playerContext.Provider, {
    value: contextValue
  }, React.createElement(positionContext.Provider, {
    value: positionContextValue
  }, children));
}

var noop = function noop() {};

var useAudioPlayer = function useAudioPlayer(options) {
  var _useContext = useContext(playerContext),
      player = _useContext.player,
      load = _useContext.load,
      rest = _objectWithoutPropertiesLoose(_useContext, ["player", "load"]);

  useEffect(function () {
    var _ref = options || {},
        src = _ref.src,
        restOptions = _objectWithoutPropertiesLoose(_ref, ["src"]); // if useAudioPlayer is called without arguments
    // don't do anything: the user will have access
    // to the current context


    if (!src) return; // todo: could improve perf even more by not calling load if the options haven't really changed across renders of the calling component

    load(_extends({
      src: src
    }, restOptions));
  }, [options, load]);
  var togglePlayPause = useCallback(function () {
    if (!player) return;

    if (player.playing()) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);
  var boundHowlerMethods = useMemo(function () {
    return {
      play: player ? player.play.bind(player) : noop,
      pause: player ? player.pause.bind(player) : noop,
      stop: player ? player.stop.bind(player) : noop,
      mute: player ? player.mute.bind(player) : noop,
      volume: player ? player.volume.bind(player) : noop,
      fade: player ? player.fade.bind(player) : noop
    };
  }, [player]);
  return useMemo(function () {
    return _extends({}, rest, boundHowlerMethods, {
      player: player,
      load: load,
      togglePlayPause: togglePlayPause
    });
  }, [rest, player, boundHowlerMethods, load, togglePlayPause]);
};

/**
 * Abstraction for useLayoutEffect.
 *
 * It will use useLayoutEffect() on the client, but while rendering on the server it will use
 * useEffect() to avoid ssr servers warnings like "useLayoutEffect does nothing on the server".
 */

var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

var useAudioPosition = function useAudioPosition(config) {
  if (config === void 0) {
    config = {};
  }

  var _config = config,
      _config$highRefreshRa = _config.highRefreshRate,
      highRefreshRate = _config$highRefreshRa === void 0 ? false : _config$highRefreshRa;

  var _useContext = useContext(playerContext),
      player = _useContext.player,
      playing = _useContext.playing,
      stopped = _useContext.stopped,
      duration = _useContext.duration;

  var _useContext2 = useContext(positionContext),
      position = _useContext2.position,
      setPosition = _useContext2.setPosition;

  var animationFrameRef = useRef(); // sets position on player initialization and when the audio is stopped

  useEffect(function () {
    if (player) {
      setPosition(player.seek());
    }
  }, [player, setPosition, stopped]); // updates position on a one second loop for low refresh rate default setting

  useEffect(function () {
    var timeout;
    if (!highRefreshRate && player && playing) timeout = window.setInterval(function () {
      return setPosition(player.seek());
    }, 1000);
    return function () {
      return clearTimeout(timeout);
    };
  }, [highRefreshRate, player, playing, setPosition]); // updates position on a 60fps loop for high refresh rate setting

  useIsomorphicLayoutEffect(function () {
    var animate = function animate() {
      setPosition(player === null || player === void 0 ? void 0 : player.seek());
      animationFrameRef.current = requestAnimationFrame(animate);
    }; // kick off a new animation cycle when the player is defined and starts playing


    if (highRefreshRate && player && playing) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return function () {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [highRefreshRate, player, playing, setPosition]);
  var seek = useCallback(function (position) {
    if (!player) return 0; // it appears that howler returns the Howl object when seek is given a position
    // to get the latest potion you must call seek again with no parameters

    var result = player.seek(position);
    var updatedPos = result.seek();
    setPosition(updatedPos);
    return updatedPos;
  }, [player, setPosition]);
  var speed = useCallback( // This should update the playback speed if the rate is provided
  // It returns the current playback speed
  function (rate) {
    if (rate) player === null || player === void 0 ? void 0 : player.rate(rate);
    return player === null || player === void 0 ? void 0 : player.rate();
  }, [player]);
  var percentComplete = useMemo(function () {
    return position / duration * 100 || 0;
  }, [duration, position]);
  return {
    position: position,
    duration: duration,
    seek: seek,
    percentComplete: percentComplete,
    speed: speed
  };
};

export { AudioPlayerProvider, useAudioPlayer, useAudioPosition };
//# sourceMappingURL=react-use-audio-player.esm.js.map
