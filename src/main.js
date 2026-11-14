import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mall, categories, brands, boulevard, events, experiences, feed, reels, tiktoks, funnel } from './data.js';
import { media, firstMedia } from './media.js';
import { initChat } from './chat.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const img = (key, alt = '', cls = '') => {
  const src = media(key);
  return src ? `<img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />` : '';
};
const waIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const icons = {
  instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.6-.3-3.9-1.1v5.7c0 7.2-7.9 9.5-11.1 4.3-2.1-3.4-.8-9.3 5.9-9.5v3.2c-.5.1-1.1.2-1.6.4-1.5.5-2.3 1.4-2.1 3 .5 3.1 6.2 4 5.7-2.1V3z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21z"/></svg>',
};
const waLink = (href, msg) => (msg && /wa\.me\//.test(href) ? `${href}?text=${encodeURIComponent(msg)}` : href);

// ── Smooth scroll ────────────────────────────────────────────
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  else document.querySelector(target)?.scrollIntoView();
}
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    $('.nav__burger').setAttribute('aria-expanded', 'false');
    scrollTo(href);
  })
);

// ── Split helpers ────────────────────────────────────────────
function splitChars(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  const chars = [];
  words.forEach((word, wi) => {
    const w = document.createElement('span');
    w.style.cssText = 'display:inline-block;white-space:nowrap';
    for (const ch of word) {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      w.appendChild(s);
      chars.push(s);
    }
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return chars;
}
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

// ── Brand: real logo + real photos as backgrounds ────────────
function renderBrand() {
  const logo = firstMedia('logo', 'logo-ig');
  if (logo) {
    $$('[data-logo-slot]').forEach((slot) => {
      const round = !media('logo') ? ' is-round' : '';
      slot.innerHTML = `<img src="${logo}" alt="Ventura Mall" class="brand-logo${round}" />`;
      slot.classList.add('has-logo');
    });
  }
  $$('[data-bg]').forEach((el) => {
    const src = firstMedia(...el.dataset.bg.split(','));
    if (src) el.style.backgroundImage = `url("${src}")`;
    else el.remove();
  });
}

// ── Content rendering ────────────────────────────────────────
function renderMarquee() {
  const items = brands.map((b) => {
    const logo = media(b.logo);
    return logo ? `<span class="has-logo"><img src="${logo}" alt="" />${esc(b.name)}<i></i></span>` : `<span>${esc(b.name)}<i></i></span>`;
  });
  $$('[data-marquee]').forEach((track, i) => {
    const list = i ? [...items].reverse() : items;
    track.innerHTML = list.join('') + list.join('');
  });
}

function renderFacts() {
  const fmt = new Intl.NumberFormat('es-BO');
  $('[data-facts]').innerHTML = mall.facts
    .map((f) => `<div class="fact" data-tilt>
        <b data-counter="${f.value}" data-plain="${f.plain ? 1 : ''}" data-suffix="${esc(f.suffix || '')}">${f.plain ? f.value : fmt.format(f.value) + (f.suffix || '')}</b>
        <span>${esc(f.label)}</span>
        <i class="glare" aria-hidden="true"></i>
      </div>`)
    .join('');
}

function renderCategories() {
  $('[data-categories]').innerHTML = categories
    .map((c) => {
      const count = brands.filter((b) => b.cat === c.id).length + (c.id === 'gastronomia' ? boulevard.length : 0);
      return `<article class="cat" data-cursor="Ver" data-cat-link="${c.id}">
        <div class="cat__media" data-tilt>
          <span class="cat__num">${c.kicker}</span>
          <span class="cat__count">${count} locales</span>
          ${img(c.media) || '<div class="cat__fallback"></div>'}
          <i class="glare" aria-hidden="true"></i>
        </div>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.blurb)}</p>
      </article>`;
    })
    .join('');
}

let activeCat = 'all';
let query = '';
function renderChips() {
  const chips = [{ id: 'all', name: 'Todas' }, ...categories];
  $('[data-chips]').innerHTML = chips
    .map((c) => {
      const n = c.id === 'all' ? brands.length : brands.filter((b) => b.cat === c.id).length;
      return `<button class="chip" role="tab" aria-selected="${c.id === activeCat}" data-chip="${c.id}">${esc(c.name)}<sup>${n}</sup></button>`;
    })
    .join('');
}

function storeCard(b) {
  const photo = img(b.media, `${b.name} en Ventura Mall`);
  const logo = media(b.logo);
  const action = b.whatsapp
    ? `<a class="store__wa" href="https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Hola ${b.name}, tengo una consulta (vengo desde venturamall.bo).`)}" target="_blank" rel="noopener">${waIcon}WhatsApp</a>`
    : b.tiktok
      ? `<a class="store__wa store__wa--tt" href="https://www.tiktok.com/@venturamalloficial/video/${b.tiktok}" target="_blank" rel="noopener">${icons.tiktok}Ver video</a>`
      : '';
  return `<article class="store" data-tilt data-brand-cat="${b.cat}">
    <div class="store__media">${photo || `<div class="store__mono">${esc(b.name)}</div>`}</div>
    <div class="store__body">
      <div class="store__id">
        ${logo ? `<img class="store__logo" src="${logo}" alt="" />` : `<span class="store__logo store__logo--mono">${esc(b.name[0])}</span>`}
        <div><h3>${esc(b.name)}</h3><span>${esc(catById[b.cat].name)}${b.where ? ` · ${esc(b.where)}` : ''}</span></div>
      </div>
      ${action}
    </div>
    <i class="glare" aria-hidden="true"></i>
  </article>`;
}

function renderBrands(animate = true) {
  const q = query.trim().toLowerCase();
  const list = brands
    .filter((b) => activeCat === 'all' || b.cat === activeCat)
    .filter((b) => !q || b.name.toLowerCase().includes(q))
    .sort((a, b) => (media(b.media) ? 1 : 0) - (media(a.media) ? 1 : 0) || a.name.localeCompare(b.name, 'es'));
  const grid = $('[data-brands]');
  grid.innerHTML = list.map(storeCard).join('');
  $('[data-empty]').hidden = list.length > 0;
  bindTilt(grid);
  if (animate && !reduced) {
    gsap.fromTo($$('.store', grid), { y: 60, opacity: 0, rotateX: -12 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04, overwrite: true });
  }
  ScrollTrigger.refresh();
}
function setCategory(id) {
  activeCat = id;
  $$('[data-chip]').forEach((c) => c.setAttribute('aria-selected', String(c.dataset.chip === id)));
  renderBrands();
}

function renderBoulevard() {
  $('[data-boulevard]').innerHTML = boulevard
    .map((r) => {
      const photo = img(r.media, r.name);
      const logo = media(r.logo);
      const reserve = r.wa
        ? `<a class="blv-card__cta" href="${waLink(r.wa, `Hola ${r.name}, quiero hacer una reserva (vengo desde venturamall.bo).`)}" target="_blank" rel="noopener">${waIcon}Reservar</a>`
        : '<span class="blv-card__cta blv-card__cta--muted">En el Boulevard</span>';
      return `<article class="blv-card${photo ? ' has-photo' : ''}" data-tilt>
        ${photo}
        <div class="blv-card__body">
          ${logo ? `<img class="blv-card__logo" src="${logo}" alt="" />` : ''}
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.cuisine)}</p>
          ${reserve}
        </div>
        <i class="glare" aria-hidden="true"></i>
      </article>`;
    })
    .join('');

  const list = reels.filter((code) => media(`reel-${code}`));
  $('[data-reels]').innerHTML = list
    .map((code) => `<a class="reel" href="https://www.instagram.com/p/${code}/" target="_blank" rel="noopener" data-cursor="Ver">
      <video src="${media(`reel-${code}`)}" poster="${media(`ig-${code}`) || ''}" muted loop playsinline preload="none"></video>
    </a>`)
    .join('');
  if (!list.length) $('[data-reels]').remove();
  $$('.reel video').forEach((v) => {
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !reduced ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
  });
}

function renderEvents() {
  $('[data-events]').innerHTML = events
    .map((e) => `<article class="event" data-tilt>
      <div class="event__media">${img(e.media, e.title) || '<div class="cat__fallback"></div>'}</div>
      <div class="event__body">
        <span class="event__when">${esc(e.when)} · ${esc(e.where)}</span>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.text)}</p>
      </div>
      <i class="glare" aria-hidden="true"></i>
    </article>`)
    .join('');
}

function renderExperiences() {
  const list = experiences.filter((e) => media(e.media));
  $('[data-exp]').innerHTML = list
    .map((e, i) => `<article class="exp-card">
        ${img(e.media, e.title)}
        <span class="exp-card__num">${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</span>
        <div class="exp-card__body"><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div>
      </article>`)
    .join('');
  if (!list.length) $('#experiencias').remove();
}

function renderTikToks() {
  $('[data-tiktoks]').innerHTML = tiktoks
    .map((id) => `<button class="tt" data-tt="${id}" data-tilt aria-label="Reproducir video de TikTok">
      ${img(`tt-${id}`) || ''}
      <span class="tt__play">${icons.tiktok}<b>Reproducir</b></span>
    </button>`)
    .join('');
  $('[data-tiktoks]').addEventListener('click', (e) => {
    const card = e.target.closest('[data-tt]');
    if (!card || card.classList.contains('is-playing')) return;
    card.classList.add('is-playing');
    card.innerHTML = `<iframe src="https://www.tiktok.com/player/v1/${card.dataset.tt}?autoplay=1&rel=0" allow="autoplay; fullscreen; encrypted-media" title="Video de TikTok de Ventura Mall"></iframe>`;
  });
}

function socialButtons(cls = 'btn') {
  return Object.entries(mall.socials)
    .map(([k, s]) => `<a class="${cls}" href="${s.url}" target="_blank" rel="noopener" data-magnetic>${icons[k]}<span>${k === 'facebook' ? 'Facebook' : s.handle}${s.followers ? ` · ${s.followers}` : ''}</span></a>`)
    .join('');
}

function renderRing() {
  const imgs = feed.map(media).filter(Boolean);
  if (imgs.length < 6) return null;
  const n = imgs.length;
  const radius = Math.max(520, window.innerWidth * 0.42);
  const ring = document.createElement('div');
  ring.className = 'ring';
  ring.innerHTML = imgs.map((src, i) => `<figure style="transform: rotateY(${(360 / n) * i}deg) translateZ(${radius}px)"><img src="${src}" alt="" loading="lazy" /></figure>`).join('');
  $('[data-ring]').appendChild(ring);
  return ring;
}

function boliviaNow() {
  const now = new Date();
  const bo = new Date(now.getTime() - 4 * 3600 * 1000); // UTC-4, no DST
  return { day: bo.getUTCDay(), hour: bo.getUTCHours() + bo.getUTCMinutes() / 60 };
}

function renderVisit() {
  $('[data-hours]').innerHTML = mall.hours.map((h) => `<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('');
  $('[data-address]').innerHTML = `${esc(mall.address)}<br />${esc(mall.city)}`;
  $('[data-contact]').innerHTML = `<a href="${mall.phoneHref}">${esc(mall.phone)}</a> · <a href="mailto:${mall.email}">${esc(mall.email)}</a>`;
  const q = encodeURIComponent(mall.mapsQuery);
  $('[data-map]').src = `https://www.google.com/maps?q=${mall.coords.lat},${mall.coords.lng}&z=16&output=embed`;
  $('[data-directions]').href = `https://www.google.com/maps/dir/?api=1&destination=${mall.coords.lat},${mall.coords.lng}`;
  $('[data-directions-alt]').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $('[data-year]').textContent = new Date().getFullYear();
  $('[data-social-btns]').innerHTML = socialButtons('btn');
  $('[data-footer-socials]').innerHTML = socialButtons('footer__social') + '<a href="#top" data-magnetic>Volver arriba ↑</a>';

  // stores: Mon–Sat 10–22, Sun 11–22 (Bolivia time)
  const { day, hour } = boliviaNow();
  const opens = day === 0 ? 11 : 10;
  const open = hour >= opens && hour < 22;
  $('[data-open-status]').textContent = open ? 'Abierto ahora' : `Abrimos ${opens}:00`;
  $('.nav__cta .dot').classList.toggle('is-closed', !open);
}

// ── WhatsApp funnel ──────────────────────────────────────────
function initFunnel() {
  const panel = $('[data-funnel]');
  const body = $('[data-funnel-body]');
  const step = (title, items, back) => {
    body.innerHTML = `${back ? '<button class="funnel__back" data-back>← Volver</button>' : ''}
      <p class="funnel__q">${esc(title)}</p>
      <div class="funnel__opts">${items.join('')}</div>`;
    gsap.fromTo($$('.funnel__opt, .funnel__q', body), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.4, ease: 'power3.out' });
  };
  const root = () =>
    step(
      'Elegí una opción',
      funnel.map((f) => `<button class="funnel__opt" data-intent="${f.id}"><span>${f.icon}</span>${esc(f.label)}<i>›</i></button>`)
    );
  body.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) return root();
    const intent = e.target.closest('[data-intent]');
    if (!intent) return;
    const f = funnel.find((x) => x.id === intent.dataset.intent);
    if (f.options) {
      step(f.ask, f.options.map((o) => `<a class="funnel__opt" href="${waLink(o.href, o.msg)}" target="_blank" rel="noopener"><span>${waIcon}</span>${esc(o.label)}<i>↗</i></a>`), true);
    } else if (f.note) {
      step(f.note, [`<a class="funnel__opt" href="${f.href}"><span>📞</span>Llamar ahora<i>↗</i></a>`, `<a class="funnel__opt" href="mailto:${mall.email}"><span>✉️</span>Enviar email<i>↗</i></a>`], true);
    } else {
      window.open(waLink(f.href, f.msg), '_blank', 'noopener');
    }
  });
  const open = () => { closePanels(); root(); panel.hidden = false; gsap.fromTo(panel, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }); };
  $$('[data-open-funnel]').forEach((b) => b.addEventListener('click', open));
}
function closePanels() { $$('.panel').forEach((p) => (p.hidden = true)); }
$$('[data-close]').forEach((b) => b.addEventListener('click', closePanels));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closePanels());

// ── 3D tilt cards with moving glare ──────────────────────────
function bindTilt(scope = document) {
  if (!finePointer || reduced) return;
  $$('[data-tilt]', scope).forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 14);
      rx((0.5 - py) * 12);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
    el.addEventListener('pointerleave', () => { rx(0); ry(0); el.classList.remove('is-tilting'); });
  });
}

// ── Render everything ────────────────────────────────────────
renderBrand();
renderMarquee();
renderFacts();
renderCategories();
renderChips();
renderBrands(false);
renderBoulevard();
renderEvents();
renderExperiences();
renderTikToks();
const ring = renderRing();
renderVisit();
initFunnel();
initChat({ closePanels });
bindTilt();

$('[data-chips]').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-chip]');
  if (chip) setCategory(chip.dataset.chip);
});
$('[data-search]').addEventListener('input', (e) => { query = e.target.value; renderBrands(); });
$('[data-categories]').addEventListener('click', (e) => {
  const card = e.target.closest('[data-cat-link]');
  if (!card) return;
  if (card.dataset.catLink === 'gastronomia') return scrollTo('#boulevard');
  setCategory(card.dataset.catLink);
  scrollTo('#marcas');
});
$('.nav__burger').addEventListener('click', (e) => {
  const open = document.body.classList.toggle('menu-open');
  e.currentTarget.setAttribute('aria-expanded', String(open));
  $('.menu').setAttribute('aria-hidden', String(!open));
});

// ── Cursor & magnetic ────────────────────────────────────────
if (finePointer) {
  const cursor = $('.cursor');
  const label = $('.cursor__label');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const hoverable = e.target.closest('a, button, input, [data-tilt]');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-hover', !labelled && !!hoverable);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
  $$('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.3);
      my((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

let lastY = 0;
ScrollTrigger.create({
  onUpdate: (self) => {
    const y = self.scroll();
    $('.nav').classList.toggle('is-hidden', y > lastY && y > 200);
    $('.nav').classList.toggle('is-solid', y > 80);
    lastY = y;
  },
});

function fitFooterMark() {
  const el = $('[data-footer-mark]');
  el.style.fontSize = '100px';
  el.style.display = 'inline-block';
  const ratio = el.parentElement.clientWidth / el.scrollWidth;
  el.style.fontSize = `${Math.floor(100 * ratio * 0.995)}px`;
  el.style.display = 'block';
}

// ── Intro + scroll choreography ──────────────────────────────
async function boot() {
  const heroChars = $$('.hero__title .split').flatMap(splitChars);
  const heroFade = $$('[data-hero-fade]');
  gsap.set(heroChars, { yPercent: 110 });
  gsap.set(heroFade, { opacity: 0, y: 20 });

  const heroModule = import('./hero.js');
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  document.fonts.load('800 100px Syne').finally(fitFooterMark);
  window.addEventListener('resize', fitFooterMark);

  let hero = null;
  try {
    const { createHero } = await heroModule;
    hero = createHero($('.hero__canvas'));
  } catch (err) {
    console.warn('WebGL unavailable, continuing without particles', err);
  }

  const counter = { v: 0 };
  const tl = gsap.timeline();
  tl.to(counter, { v: 100, duration: reduced ? 0.2 : 1.6, ease: 'power2.inOut', onUpdate: () => ($('[data-count]').textContent = Math.round(counter.v)) })
    .to('.loader__inner', { opacity: 0, duration: 0.4 })
    .to('.loader__panel--top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .to('.loader__panel--bottom', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .add(() => { document.body.classList.remove('is-loading'); $('.loader').remove(); lenis?.start(); })
    .fromTo('.hero__bg', { scale: 1.25, opacity: 0 }, { scale: 1.08, opacity: 1, duration: 2.4, ease: 'expo.out' }, '-=0.9')
    .to(heroChars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.03 }, '<0.2')
    .to(heroFade, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, '<0.3');

  if (hero) {
    tl.to(hero.uniforms.uAssemble, { value: 1, duration: 3.2, ease: 'power3.inOut' }, 1.2);
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (hero.uniforms.uScroll.value = s.progress) });
  }
  if (!reduced) setupScroll();
  ScrollTrigger.refresh();
}

function setupScroll() {
  gsap.to('.hero__content', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // marquee: velocity-reactive loop
  const loops = $$('[data-marquee]').map((track) => {
    const rev = track.dataset.marquee === 'rev';
    return gsap.fromTo(track, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 45, ease: 'none', repeat: -1 });
  });
  let dir = 1, velocity = 0, speed = 1, skew = 0;
  const skewSet = gsap.quickSetter('[data-marquee]', 'skewX', 'deg');
  ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onUpdate: (self) => { velocity = self.getVelocity(); if (velocity) dir = Math.sign(velocity); } });
  gsap.ticker.add(() => {
    const target = dir * (1 + Math.min(Math.abs(velocity) / 300, 6));
    speed += (target - speed) * 0.1;
    skew += (gsap.utils.clamp(-10, 10, velocity / -250) - skew) * 0.1;
    velocity *= 0.9;
    loops.forEach((l) => l.timeScale(speed));
    skewSet(skew);
  });

  // manifesto
  gsap.to(splitWords($('[data-words]')), { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // facts: cards flip up in 3D, numbers count, photo drifts
  gsap.fromTo('.facts__bg', { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: '.facts', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.fact', { rotationX: -70, y: 80, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 900, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.facts__grid', start: 'top 82%' } });
  const fmt = new Intl.NumberFormat('es-BO');
  $$('[data-counter]').forEach((el) => {
    const end = +el.dataset.counter;
    const plain = !!el.dataset.plain;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const o = { v: plain ? end - 12 : 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = (plain ? Math.round(o.v) : fmt.format(Math.round(o.v))) + (el.dataset.suffix || '')) });
      },
    });
  });

  // horizontal categories
  const track = $('.hscroll__track');
  const dist = () => track.scrollWidth - window.innerWidth;
  const htween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.hscroll', pin: '.hscroll__pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true } });
  gsap.to('.hscroll__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.hscroll', start: 'top top', end: () => '+=' + dist(), scrub: true } });
  $$('.cat').forEach((card) => {
    const im = $('img', card);
    if (im) gsap.fromTo(im, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: htween, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(card, { rotationY: -25, z: -200, opacity: 0.3, transformPerspective: 1200, ease: 'power2.out', scrollTrigger: { trigger: card, containerAnimation: htween, start: 'left 100%', end: 'left 55%', scrub: true } });
  });

  $$('[data-reveal-lines]').forEach((h) => gsap.from(h, { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } }));
  ScrollTrigger.create({ trigger: '.store-grid', start: 'top 85%', once: true, onEnter: () => renderBrands(true) });

  // boulevard + events: staggered 3D rise
  ['.blv-card', '.event', '.tt'].forEach((sel) => {
    if (!$(sel)) return;
    ScrollTrigger.batch(sel, {
      start: 'top 88%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 80, rotationX: -25, opacity: 0, transformPerspective: 1000 }, { y: 0, rotationX: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.07 }),
    });
  });
  if ($('.reels')) gsap.fromTo('.reels', { x: '10vw' }, { x: '-10vw', ease: 'none', scrollTrigger: { trigger: '.reels', start: 'top bottom', end: 'bottom top', scrub: true } });

  // stacked experience cards
  const cards = $$('.exp-card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, { scale: 0.9 - (cards.length - i) * 0.01, filter: 'brightness(0.45)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 10%', scrub: true } });
  });

  if (ring) gsap.fromTo(ring, { rotateY: 0, rotateX: -8 }, { rotateY: -200, rotateX: 8, ease: 'none', scrollTrigger: { trigger: '.social', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  gsap.from(splitChars($('[data-footer-mark]')), { yPercent: 100, opacity: 0, stagger: 0.05, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 70%' } });
}

document.body.classList.add('is-loading');
boot();
