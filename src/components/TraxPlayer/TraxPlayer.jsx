import { useEffect, useId, useRef, useState } from 'react';
import traxTracks from '../../data/trax';
import './TraxPlayer.scss';

const COLLAPSE_DELAY_MS = 1000;
const TRACK_REVEAL_MS = 2200;

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = String(total % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const TraxPlayer = ({ labels, lang = 'ru', soundEnabled = true }) => {
  const audioRef = useRef(null);
  const shouldResumeRef = useRef(false);
  const collapseTimerRef = useRef(null);
  const hoveredRef = useRef(false);
  const skipTrackRevealRef = useRef(true);
  const rafRef = useRef(0);
  const gid = useId().replace(/:/g, '');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);
  const locale = lang === 'en' ? 'en' : 'ru';
  const track = traxTracks[index];
  const trackTitle = track.title[locale] || track.title.en;
  const trackNote = track.note[locale] || track.note.en;

  const syncProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const nextTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const clampedTime = nextDuration > 0 ? Math.min(nextTime, nextDuration) : nextTime;

    setDuration(nextDuration);
    setCurrentTime(clampedTime);
    setProgress(nextDuration > 0 ? (clampedTime / nextDuration) * 100 : 0);
  };

  useEffect(() => {
    return () => {
      clearTimeout(collapseTimerRef.current);
      clearTimeout(toastTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const showToast = (message) => {
    if (!message) return;
    clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(''), 3200);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !soundEnabled;
    if (!soundEnabled && !audio.paused) {
      audio.pause();
      setPlaying(false);
    }
  }, [soundEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onEnded = () => {
      const total = Number.isFinite(audio.duration) ? audio.duration : 0;
      setPlaying(false);
      setCurrentTime(total);
      setDuration(total);
      setProgress(total > 0 ? 100 : 0);
      shouldResumeRef.current = true;
      setIndex((current) => (current + 1) % traxTracks.length);
    };
    const onPlay = () => {
      setPlaying(true);
      setMissing(false);
      syncProgress();
    };
    const onPause = () => {
      setPlaying(false);
      syncProgress();
    };
    const onError = () => {
      setMissing(true);
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', syncProgress);
    audio.addEventListener('loadedmetadata', syncProgress);
    audio.addEventListener('durationchange', syncProgress);
    audio.addEventListener('seeked', syncProgress);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', syncProgress);
      audio.removeEventListener('loadedmetadata', syncProgress);
      audio.removeEventListener('durationchange', syncProgress);
      audio.removeEventListener('seeked', syncProgress);
    };
  }, []);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    const tick = () => {
      syncProgress();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setMissing(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    audio.pause();
    audio.src = track.src;
    audio.load();

    if (!shouldResumeRef.current) return;
    shouldResumeRef.current = false;

    audio.play().catch(() => {
      setMissing(true);
      setPlaying(false);
    });
  }, [index, track.src]);

  useEffect(() => {
    if (skipTrackRevealRef.current) {
      skipTrackRevealRef.current = false;
      return;
    }

    clearTimeout(collapseTimerRef.current);
    setOpen(true);

    if (hoveredRef.current) return;

    collapseTimerRef.current = setTimeout(() => {
      if (!hoveredRef.current) {
        setOpen(false);
      }
    }, TRACK_REVEAL_MS);
  }, [index]);

  const openPanel = () => {
    clearTimeout(collapseTimerRef.current);
    hoveredRef.current = true;
    setOpen(true);
  };

  const scheduleCollapse = () => {
    hoveredRef.current = false;
    clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, COLLAPSE_DELAY_MS);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (!soundEnabled) {
      openPanel();
      showToast(labels.soundOff);
      return;
    }

    if (!audio.src || !audio.src.includes(track.src.replace(/^\//, ''))) {
      audio.src = track.src;
      audio.load();
    }

    try {
      await audio.play();
    } catch {
      setMissing(true);
      setPlaying(false);
    }
  };

  const changeTrack = (nextIndex) => {
    shouldResumeRef.current = !audioRef.current?.paused || playing;
    setIndex(nextIndex);
  };

  const prev = () => {
    changeTrack((index - 1 + traxTracks.length) % traxTracks.length);
  };

  const next = () => {
    changeTrack((index + 1) % traxTracks.length);
  };

  const seek = (event) => {
    const audio = audioRef.current;
    const trackEl = event.currentTarget;
    if (!audio || !audio.duration || Number.isNaN(audio.duration)) return;

    const rect = trackEl.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setCurrentTime(audio.currentTime);
    setProgress(ratio * 100);
  };

  return (
    <section
      className={`trax${open ? ' is-open' : ''}`}
      aria-label={labels.aria}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleCollapse}
      onFocusCapture={openPanel}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleCollapse();
        }
      }}
    >
      <audio ref={audioRef} preload="none" />
      {toast ? (
        <p className="trax__toast" role="status" aria-live="polite">
          {toast}
        </p>
      ) : null}
      <div className="trax__clip">
        <div className="trax__shell">
          <button
            type="button"
            className={`trax__badge${playing ? ' is-playing' : ''}`}
            onClick={togglePlay}
            aria-label={playing ? labels.pause : labels.play}
          >
            <svg className="trax__badge-svg" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id={`${gid}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d8dce0" />
                  <stop offset="45%" stopColor="#8b9299" />
                  <stop offset="100%" stopColor="#3a3f44" />
                </linearGradient>
                <linearGradient id={`${gid}-bevel`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f5f7f8" />
                  <stop offset="40%" stopColor="#b7c0c4" />
                  <stop offset="100%" stopColor="#6d747b" />
                </linearGradient>
                <radialGradient id={`${gid}-face`} cx="34%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#f3f5f7" />
                  <stop offset="100%" stopColor="#d5dade" />
                </radialGradient>
                <linearGradient id={`${gid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <circle cx="50" cy="50" r="49.5" fill="#b0ce7c" />
              <circle cx="50" cy="50" r="47" fill={`url(#${gid}-rim)`} />
              <circle cx="50" cy="50" r="42" fill={`url(#${gid}-bevel)`} />
              <circle cx="50" cy="50" r="38" fill="#2b3035" />
              <circle cx="50" cy="50" r="36.4" fill={`url(#${gid}-face)`} />
              <ellipse cx="42" cy="34" rx="20" ry="12" fill={`url(#${gid}-shine)`} />

              {playing ? (
                <g fill="#005ca9">
                  <rect x="36" y="32" width="9" height="36" rx="1.5" />
                  <rect x="55" y="32" width="9" height="36" rx="1.5" />
                </g>
              ) : (
                <path fill="#005ca9" d="M36 30v40l34-20z" />
              )}
            </svg>
          </button>

          <div className="trax__body">
            <p className="trax__artist">{track.artist}</p>
            <p className="trax__title">“{trackTitle}”</p>
            <p className="trax__note">{trackNote}</p>
            {missing ? <p className="trax__hint">{labels.missing}</p> : null}
          </div>
        </div>
      </div>

      <div className="trax__dock">
        <div className="trax__progress-row">
          <span className="trax__time trax__time--current" aria-live="off">
            {formatTime(currentTime)}
          </span>
          <button
            type="button"
            className="trax__progress"
            aria-label={labels.progress || labels.aria}
            onClick={seek}
          >
            <span className="trax__progress-track">
              <span className="trax__progress-fill" style={{ width: `${progress}%` }} />
              <span className="trax__progress-thumb" style={{ left: `${progress}%` }} />
            </span>
          </button>
          <span className="trax__time trax__time--total">{formatTime(duration)}</span>
        </div>

        <div className="trax__controls">
          <button type="button" onClick={prev} aria-label={labels.prev}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6h2.2v12H6zm3.4 6 8.6 6.2V5.8z" />
            </svg>
          </button>
          <button type="button" onClick={togglePlay} aria-label={playing ? labels.pause : labels.play}>
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6.5" y="5.5" width="3.8" height="13" rx="1" />
                <rect x="13.7" y="5.5" width="3.8" height="13" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            )}
          </button>
          <button type="button" onClick={next} aria-label={labels.next}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.8 6H18v12h-2.2zm-1.2 6L6 5.8v12.4z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TraxPlayer;
