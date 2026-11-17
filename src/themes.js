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

function updateWatch() {
  const w = /watch|[?&]v=/.test(location.hash + location.search);
  document.documentElement.classList.toggle('ytaf-watch', w);
}
window.addEventListener('hashchange', updateWatch);
setInterval(updateWatch, 1000);
updateWatch();

let dbgTimer = null;
export function setDebug(on) {
  let el = document.getElementById('ytaf-debug');
  if (!on) {
    clearInterval(dbgTimer);
    dbgTimer = null;
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('div');
    el.id = 'ytaf-debug';
    document.body.appendChild(el);
  }
  dbgTimer = setInterval(() => {
    const chain = [];
    let n = document.activeElement;
    while (n && n !== document.body && chain.length < 8) {
      chain.push(
        n.tagName.toLowerCase() +
          '.' +
          String(n.className || '')
            .split(' ')
            .slice(0, 3)
            .join('.')
      );
      n = n.parentElement;
    }
    const tags = {};
    document.querySelectorAll('*').forEach((e) => {
      const t = e.tagName.toLowerCase();
      if (t.startsWith('ytlr-')) tags[t] = 1;
    });
    const dump = {
      hash: location.hash.slice(0, 40),
      focus: chain,
      tags: Object.keys(tags)
    };
    try {
      localStorage.setItem('ytaf-dump', JSON.stringify(dump));
    } catch {
      /* ignore */
    }
    el.textContent =
      'FOCUS: ' + chain.join(' < ') + '\nTAGS: ' + dump.tags.join(' ');
  }, 1500);
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
  const wrap = document.createElement('div');
  wrap.appendChild(btn);
  return wrap;
}

applyTheme(configRead('uiTheme'));
