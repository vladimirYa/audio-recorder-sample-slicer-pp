import { resolveLocale } from './locale.js';

const $ = selector => document.querySelector(selector);
let content, locale, index = 0;
let motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function image() {
  $('#demo-image').src = `assets/${content[locale].slides[index].demo}.${motion && !document.hidden ? 'gif' : 'png'}`;
  $('#motion').textContent = content[locale][motion ? 'pause' : 'play'];
  $('#motion').setAttribute('aria-pressed', String(motion));
}
function render() {
  const copy = content[locale], slide = copy.slides[index];
  document.documentElement.lang = locale.replace('_', '-');
  document.title = `${copy.news} · Sampleboy`;
  $('#language').value = locale;
  $('#title').textContent = slide.title;
  $('#intro').textContent = slide.intro;
  $('#badge').textContent = copy.badge;
  $('#counter').textContent = `${String(index + 1).padStart(2, '0')} / 08`;
  $('#back').textContent = `← ${copy.back}`;
  $('#next').textContent = index === 7 ? `${copy.restart} ↺` : `${copy.next} →`;
  $('#back').disabled = index === 0;
  $('#section-name').textContent = slide.title;
  for (const node of document.querySelectorAll('[data-copy]')) node.textContent = copy[node.dataset.copy];
  $('#chapters').replaceChildren(...copy.slides.map((item, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = String(i + 1).padStart(2, '0');
    button.setAttribute('aria-label', item.title);
    if (i === index) button.setAttribute('aria-current', 'step');
    button.addEventListener('click', () => go(i)); return button;
  }));
  $('#tips').replaceChildren(...slide.tips.map(([keys, text]) => {
    const li = document.createElement('li');
    if (keys) { const kbd = document.createElement('kbd'); kbd.textContent = keys; li.append(kbd); }
    const span = document.createElement('span'); span.textContent = text; li.append(span); return li;
  }));
  image();
  const url = new URL(location.href);
  url.searchParams.set('lang', locale); url.hash = slide.demo;
  history.replaceState(null, '', url);
}
function go(next) { index = Math.max(0, Math.min(7, next)); render(); }
try {
  const response = await fetch('./content.json');
  if (!response.ok) throw Error('Update content unavailable');
  content = await response.json();
  locale = resolveLocale(new URL(location.href).searchParams.get('lang') || navigator.language);
  index = Math.max(0, content[locale].slides.findIndex(slide => `#${slide.demo}` === location.hash));
  render();
  $('#language').addEventListener('change', event => { locale = event.target.value; render(); });
  $('#back').addEventListener('click', () => go(index - 1));
  $('#next').addEventListener('click', () => go(index === 7 ? 0 : index + 1));
  $('#motion').addEventListener('click', () => { motion = !motion; image(); });
  document.addEventListener('visibilitychange', image);
  document.addEventListener('keydown', event => {
    if (event.target.closest('select, input') || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); go(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
} catch (error) { $('#load-error').hidden = false; console.error(error); }
