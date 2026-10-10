'use strict';

// Loaded before styles on every page so the saved theme is applied before paint.
(() => {
  const storageKey = 'pf-theme';
  const modes = ['light', 'dark', 'system'];
  const media = matchMedia('(prefers-color-scheme: dark)');
  const normalize = value => modes.includes(value) ? value : 'system';
  let preference = 'system';
  try { preference = normalize(localStorage.getItem(storageKey)); } catch { /* Preference still works for this visit. */ }
  function apply() {
    const resolved = preference === 'system' ? media.matches ? 'dark' : 'light' : preference;
    document.documentElement.dataset.bsTheme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#141416' : '#f7f8fa');
    document.dispatchEvent(new CustomEvent('promptforge:theme', { detail: { preference, resolved } }));
  }
  window.promptforgeTheme = Object.freeze({
    get: () => preference,
    set: value => {
      preference = normalize(value);
      try { localStorage.setItem(storageKey, preference); } catch { /* Keep the selection in memory. */ }
      apply();
    }
  });
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => { if (event.key === storageKey || event.key === null) { preference = normalize(event.newValue); apply(); } });
  apply();
})();
