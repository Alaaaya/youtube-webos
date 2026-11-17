import { configRead, configWrite, configAddChangeListener } from './config.js';
import './themes.css';

export const THEMES = [
  ['original', 'Original'],
  ['harak', 'Harak - red'],
  ['aya', 'Aya - plum rose'],
  ['velour', 'Velour - peach night']
];

export function applyTheme(id) {
  const root = document.documentElement;
  if (!id || id === 'original' || !THEMES.some((t) => t[0] === id)) {
    root.removeAttribute('data-ytaf-theme');
  } else {
    root.setAttribute('data-ytaf-theme', id);
  }
}

export function createThemeButton() {
  const btn = document.createElement('button');
  btn.className = 'ytaf-theme-btn';
  const label = () => {
    const cur = THEMES.find((t) => t[0] === configRead('uiTheme')) || THEMES[0];
    btn.textContent = 'Theme: ' + cur[1] + ' (OK to change)';
  };
  btn.addEventListener('click', () => {
    const i = THEMES.findIndex((t) => t[0] === configRead('uiTheme'));
    configWrite('uiTheme', THEMES[(i + 1) % THEMES.length][0]);
  });
  configAddChangeListener('uiTheme', (evt) => {
    applyTheme(evt.detail.newValue);
    label();
  });
  label();
  return btn;
}

applyTheme(configRead('uiTheme'));
