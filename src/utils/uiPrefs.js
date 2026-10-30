const SOUND_KEY = 'resume-sound';
const EFFECTS_KEY = 'resume-effects';

export const readSoundEnabled = () => localStorage.getItem(SOUND_KEY) !== 'off';
export const readEffectsEnabled = () => localStorage.getItem(EFFECTS_KEY) !== 'off';

export const setSoundEnabled = (enabled) => {
  const next = Boolean(enabled);
  localStorage.setItem(SOUND_KEY, next ? 'on' : 'off');
  document.documentElement.setAttribute('data-sound', next ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent('resume-prefs', { detail: { sound: next } }));
};

export const setEffectsEnabled = (enabled) => {
  const next = Boolean(enabled);
  localStorage.setItem(EFFECTS_KEY, next ? 'on' : 'off');
  document.documentElement.setAttribute('data-effects', next ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent('resume-prefs', { detail: { effects: next } }));
};

export const applyPrefsToDocument = () => {
  document.documentElement.setAttribute('data-sound', readSoundEnabled() ? 'on' : 'off');
  document.documentElement.setAttribute('data-effects', readEffectsEnabled() ? 'on' : 'off');
};
