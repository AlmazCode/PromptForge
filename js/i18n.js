'use strict';

import { messages } from './locales/messages.js';
import { taskTranslations, exerciseTranslations } from './locales/tasks.js';

export const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'kk', label: 'KZ', name: 'Қазақша' }
];
export const storageKey = 'pf-language';
let current = 'en';
const bindings = new WeakMap();
const attributes = new WeakMap();
const ignored = 'script, style, svg, code, pre, kbd, samp, textarea, [data-i18n-ignore]';

export function normalizeLocale(value) {
  const code = String(value || '').toLowerCase().split('-')[0];
  return code === 'kz' ? 'kk' : languages.some(language => language.code === code) ? code : 'en';
}
export function getLocale() { return current; }
export function localeTag(code = current) { return { en: 'en-US', ru: 'ru-RU', kk: 'kk-KZ' }[normalizeLocale(code)]; }
export function phrase(source, params = {}) { return { source, params }; }

export function t(source, params = {}, code = current) {
  if (source && typeof source === 'object' && 'source' in source) return t(source.source, source.params, code);
  const original = String(source ?? '');
  const normalized = normalizeLocale(code);
  const translated = normalized === 'en' ? original : messages[original]?.[normalized === 'ru' ? 0 : 1] || original;
  return translated.replace(/\{([A-Za-z0-9_]+)\}/g, (match, name) => {
    const value = params[name];
    return value === undefined ? match : String(typeof value === 'function' ? value() : value && typeof value === 'object' && 'source' in value ? t(value, {}, code) : value);
  });
}

export function write(node, value, raw = false) {
  if (!node) return;
  if (raw) {
    node.setAttribute('data-i18n-ignore', ''); bindings.delete(node);
    node.textContent = String(value ?? ''); return;
  }
  node.removeAttribute('data-i18n-ignore');
  const source = value && typeof value === 'object' && 'source' in value ? value : phrase(String(value ?? ''));
  bindings.set(node, source); node.textContent = t(source);
}

export function localizedTask(task, code = current) {
  const translation = taskTranslations[normalizeLocale(code)]?.[task.id];
  return translation ? { ...task, title: translation.title, description: translation.description, tags: task.tags.map(tag => t(tag, {}, code)), searchText: `${task.title} ${task.description} ${task.tags.join(' ')}` } : task;
}

export function localizedExercise(id, original, code = current) {
  return { ...original, ...exerciseTranslations[normalizeLocale(code)]?.[id] };
}

export function writeAttribute(node, name, value) {
  if (!['placeholder', 'aria-label', 'alt', 'title'].includes(name)) { node.setAttribute(name, String(value)); return; }
  const attrs = attributes.get(node) || {};
  attrs[name] = value; attributes.set(node, attrs); node.setAttribute(name, t(value));
}

export function translatePage(root = document.documentElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!parent || parent.closest(ignored)) continue;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const binding = bindings.get(node);
      if (binding) {
        // Status messages can have an action link appended after their text.
        if (node.childElementCount) {
          if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.data = t(binding);
          else node.prepend(document.createTextNode(t(binding)));
        } else node.textContent = t(binding);
      }
      const attrs = attributes.get(node) || {};
      for (const name of ['placeholder', 'aria-label', 'alt', 'title']) {
        if (!node.hasAttribute(name)) continue;
        attrs[name] ??= node.getAttribute(name);
        node.setAttribute(name, t(attrs[name]));
      }
      if (node.matches('meta[name="description"]')) {
        attrs.content ??= node.content; node.content = t(attrs.content);
      }
      attributes.set(node, attrs);
    } else if (!bindings.has(parent)) {
      const previous = bindings.get(node);
      const source = previous?.source || node.data;
      // Keep whitespace around inline elements; never rebuild mixed-content HTML.
      const normalized = source.trim().replace(/\s+/g, ' ');
      bindings.set(node, phrase(source));
      if (messages[normalized]) node.data = source.replace(/\S[\s\S]*\S|\S/, t(normalized));
    }
  }
}

export function setLocale(code, { persist = true } = {}) {
  current = normalizeLocale(code);
  if (typeof document === 'undefined') return current;
  document.documentElement.lang = current;
  if (persist) { try { localStorage.setItem(storageKey, current); } catch { /* Language still works for this page. */ } }
  translatePage();
  document.querySelectorAll('[data-language]').forEach(button => {
    const selected = button.dataset.language === current;
    button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected));
  });
  document.dispatchEvent(new CustomEvent('promptforge:language', { detail: { locale: current } }));
  translatePage();
  return current;
}

export function setupI18n() {
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch { /* Use browser language. */ }
  current = normalizeLocale(saved || navigator.language);
  const group = document.createElement('div'); group.className = 'language-switcher btn-group';
  group.setAttribute('role', 'group'); group.setAttribute('aria-label', 'Interface language');
  for (const language of languages) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn-outline-secondary btn-sm';
    button.textContent = language.label; button.dataset.language = language.code; button.lang = language.code;
    button.setAttribute('aria-label', language.name); button.addEventListener('click', () => setLocale(language.code));
    group.append(button);
  }
  document.querySelector('#navigation-toggle').before(group);
  setLocale(current, { persist: false });
  window.addEventListener('storage', event => { if (event.key === storageKey) setLocale(event.newValue, { persist: false }); });
}
