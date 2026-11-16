import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mall, funnel, mallLogo } from './content.js';
import { $, $$, esc, icons, reduced, finePointer, bindMagnetic, waLink, mallOpen } from './ui.js';
import { route, initRouter } from './router.js';
import { initChat } from './chat.js';
import { splitChars } from './split.js';

gsap.registerPlugin(ScrollTrigger);
history.scrollRestoration = 'manual';

// ── Smooth scroll ────────────────────────────────────────────
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
const scrollTo = (target) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (lenis) lenis.scrollTo(el ?? 0, { offset: el ? -10 : 0, duration: 1.4 });
  else if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
};

// ── Routes (views are code-split) ────────────────────────────
route(/^\/$/, async () => (await import('./views/home.js')).homeView());
route(/^\/tiendas$/, async () => (await import('./views/directory.js')).directoryView());
route(/^\/tiendas\/([\w-]+)$/, async (slug) => (await import('./views/place.js')).placeView('store', slug));
route(/^\/boulevard$/, async () => (await import('./views/boulevard.js')).boulevardView());
route(/^\/boulevard\/([\w-]+)$/, async (slug) => (await import('./views/place.js')).placeView('restaurant', slug));
route(/^\/legal\/([\w-]+)$/, async (slug) => (await import('./views/legal.js')).legalView(slug));
route(/^\/ayuda$/, async () => (await import('./views/legal.js')).helpView());
const notFound = async () => (await import('./views/boulevard.js')).notFoundView();

// ── Brand: the mall's own logo (the red "V" from @venturamalloficial) ──
const logo = mallLogo();
if (logo) {
  $$('[data-logo-mark]').forEach((el) => (el.innerHTML = `<img src="${logo}" alt="" />`));
  const link = document.querySelector('link[rel="icon"]');
  if (link) link.href = logo;
}

// ── Nav ──────────────────────────────────────────────────────
function setActiveNav() {
  const p = location.pathname;
  $$('.nav__links a, .menu a').forEach((a) => {
    const href = a.getAttribute('href');
    const on = href === '/' ? p === '/' && !location.hash : !href.includes('#') && p.startsWith(href);
    a.classList.toggle('is-active', on);
  });
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  $('.nav__burger').setAttribute('aria-expanded', 'false');
  $('.menu').setAttribute('aria-hidden', 'true');
}
$('.nav__burger').addEventListener('click', (e) => {
  const open = document.body.classList.toggle('menu-open');
  e.currentTarget.setAttribute('aria-expanded', String(open));
  $('.menu').setAttribute('aria-hidden', String(!open));
  if (open && !reduced) gsap.from('.menu a', { yPercent: 100, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
});
let lastY = 0;
ScrollTrigger.create({
  onUpdate: (self) => {
    const y = self.scroll();
    $('.nav').classList.toggle('is-hidden', y > lastY && y > 240 && !document.body.classList.contains('menu-open'));
    $('.nav').classList.toggle('is-solid', y > 60);
    lastY = y;
  },
});
const { open, opens } = mallOpen();
$('[data-open-status]').textContent = open ? 'Abierto ahora' : `Abrimos ${opens}:00`;
$('.nav__cta .dot').classList.toggle('is-closed', !open);

// ── Footer ───────────────────────────────────────────────────
function socialLinks() {
  return Object.entries(mall.socials).map(([k, s]) => `<a class="footer__social" href="${s.url}" target="_blank" rel="noopener">${icons[k]}<span>${k === 'facebook' ? 'Facebook' : s.handle}</span></a>`).join('');
}
$('[data-footer-socials]').innerHTML = socialLinks();
$('[data-year]').textContent = new Date().getFullYear();
function fitFooterMark() {
  const el = $('[data-footer-mark]');
  el.style.fontSize = '100px';
  el.style.display = 'inline-block';
  const ratio = el.parentElement.clientWidth / el.scrollWidth;
  el.style.fontSize = `${Math.floor(100 * ratio * 0.995)}px`;
  el.style.display = 'block';
}
let footerChars = [];

// ── WhatsApp funnel ──────────────────────────────────────────
function closePanels() { $$('.panel').forEach((p) => (p.hidden = true)); }
$$('[data-close]').forEach((b) => b.addEventListener('click', closePanels));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closePanels());
(function initFunnel() {
  const panel = $('[data-funnel]');
  const body = $('[data-funnel-body]');
  const step = (title, items, back) => {
    body.innerHTML = `${back ? '<button class="funnel__back" data-back>← Volver</button>' : ''}
      <p class="funnel__q">${esc(title)}</p><div class="funnel__opts">${items.join('')}</div>`;
    gsap.fromTo($$('.funnel__opt, .funnel__q', body), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.4, ease: 'power3.out' });
  };
  const root = () => step('Elegí una opción', funnel.map((f) => `<button class="funnel__opt" data-intent="${f.id}"><span>${f.icon}</span>${esc(f.label)}<i>›</i></button>`));
  body.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) return root();
    const intent = e.target.closest('[data-intent]');
    if (!intent) return;
    const f = funnel.find((x) => x.id === intent.dataset.intent);
    if (f.options) step(f.ask, f.options.map((o) => `<a class="funnel__opt" href="${waLink(o.href, o.msg)}" target="_blank" rel="noopener"><span>${icons.wa}</span>${esc(o.label)}<i>↗</i></a>`), true);
    else if (f.note) step(f.note, [`<a class="funnel__opt" href="${f.href}"><span>📞</span>Llamar ahora<i>↗</i></a>`, `<a class="funnel__opt" href="mailto:${mall.email}"><span>✉️</span>Enviar email<i>↗</i></a>`], true);
    else window.open(waLink(f.href, f.msg), '_blank', 'noopener');
  });
  // delegated: views add their own [data-open-funnel] buttons
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-open-funnel]')) return;
    closePanels(); root(); panel.hidden = false;
    gsap.fromTo(panel, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  });
})();
initChat({ closePanels });

// ── Cookie notice (informative; the site sets no tracking cookies) ──
(function cookieNotice() {
  let seen = false;
  try { seen = localStorage.getItem('vm-cookies-ok') === '1'; } catch { /* storage blocked */ }
  if (seen) return;
  const el = document.createElement('div');
  el.className = 'cookie';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Aviso de cookies');
  el.innerHTML = `<p>No usamos cookies de seguimiento. El mapa, las tipografías y algunos videos son de terceros y pueden usar las suyas. <a href="/legal/cookies">Más info</a></p><button class="btn btn--sm" type="button">Entendido</button>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('is-in'), 2600);
  el.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem('vm-cookies-ok', '1'); } catch { /* ignore */ }
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 600);
  });
})();

// ── Cursor ───────────────────────────────────────────────────
if (finePointer) {
  const cursor = $('.cursor');
  const label = $('.cursor__label');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const hoverable = e.target.closest('a, button, input, [data-tilt], [data-vcard]');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-hover', !labelled && !!hoverable);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
}

// ── Keep scroll animations accurate ──────────────────────────
// Lazy images and late fonts change the page height after triggers are
// measured; without this, reveals fire in the wrong place (or never).
let refreshTimer = 0;
const queueRefresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200); };
document.addEventListener('load', (e) => { if (e.target.tagName === 'IMG') queueRefresh(); }, true);
document.fonts?.addEventListener?.('loadingdone', queueRefresh);
window.addEventListener('load', queueRefresh);

// ── Boot ─────────────────────────────────────────────────────
async function boot() {
  document.body.classList.add('is-loading');
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  document.fonts.load('800 100px Syne').finally(fitFooterMark);
  window.addEventListener('resize', fitFooterMark);
  footerChars = splitChars($('[data-footer-mark]'));

  await initRouter({
    lenis,
    scrollTo,
    notFound,
    onLinkClick: closeMenu,
    onRender: (view, { first }) => {
      setActiveNav();
      bindMagnetic(document);
      $$('.cursor').forEach((c) => c.classList.remove('is-hover', 'is-label'));
      if (!first) refreshFooter();
    },
  });

  // loader → reveal
  const counter = { v: 0 };
  const tl = gsap.timeline();
  tl.to(counter, { v: 100, duration: reduced ? 0.2 : 1.5, ease: 'power2.inOut', onUpdate: () => ($('[data-count]').textContent = Math.round(counter.v)) })
    .to('.loader__inner', { opacity: 0, duration: 0.4 })
    .to('.loader__panel--top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .to('.loader__panel--bottom', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .add(() => { document.body.classList.remove('is-loading'); $('.loader').remove(); lenis?.start(); ScrollTrigger.refresh(); });
  refreshFooter();
}

let footerST = null;
function refreshFooter() {
  if (reduced || !footerChars.length) return;
  footerST?.scrollTrigger?.kill();
  footerST?.kill();
  gsap.set(footerChars, { yPercent: 100, opacity: 0 });
  footerST = gsap.to(footerChars, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });
}

boot();
