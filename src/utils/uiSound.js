import { readEffectsEnabled, readSoundEnabled } from './uiPrefs';

const HOVER_SRC = '/trax/click1.wav';
const PRESS_SRC = '/trax/click2.wav';

let hoverAudio;
let pressAudio;
let soundEnabled = typeof window !== 'undefined' ? readSoundEnabled() : true;
let effectsEnabled = typeof window !== 'undefined' ? readEffectsEnabled() : true;

const getHover = () => {
  if (!hoverAudio) {
    hoverAudio = new Audio(HOVER_SRC);
    hoverAudio.preload = 'auto';
    hoverAudio.volume = 0.4;
  }
  return hoverAudio;
};

const getPress = () => {
  if (!pressAudio) {
    pressAudio = new Audio(PRESS_SRC);
    pressAudio.preload = 'auto';
    pressAudio.volume = 0.5;
  }
  return pressAudio;
};

const stopUiSounds = () => {
  [hoverAudio, pressAudio].forEach((audio) => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  });
};

export const syncUiSoundEnabled = (enabled) => {
  soundEnabled = Boolean(enabled);
  if (!soundEnabled) stopUiSounds();
};

export const syncUiEffectsEnabled = (enabled) => {
  effectsEnabled = Boolean(enabled);
  if (!effectsEnabled) stopUiSounds();
};

const canPlayUiSound = () => {
  if (!soundEnabled || !effectsEnabled) return false;
  if (typeof document === 'undefined') return false;
  if (document.documentElement.getAttribute('data-sound') === 'off') return false;
  if (document.documentElement.getAttribute('data-effects') === 'off') return false;
  return true;
};

const play = (audio) => {
  if (typeof window === 'undefined') return;
  if (!canPlayUiSound()) return;

  try {
    audio.muted = false;
    audio.currentTime = 0;
    void audio.play();
  } catch {
    // Ignore autoplay / missing file errors
  }
};

export const playHoverSound = () => play(getHover());
export const playPressSound = () => play(getPress());

export const uiSoundProps = {
  onMouseEnter: playHoverSound,
  onPointerDown: playPressSound,
};

if (typeof window !== 'undefined') {
  syncUiSoundEnabled(readSoundEnabled());
  syncUiEffectsEnabled(readEffectsEnabled());
  window.addEventListener('resume-prefs', (event) => {
    if (typeof event.detail?.sound === 'boolean') {
      syncUiSoundEnabled(event.detail.sound);
    }
    if (typeof event.detail?.effects === 'boolean') {
      syncUiEffectsEnabled(event.detail.effects);
    }
  });
}
