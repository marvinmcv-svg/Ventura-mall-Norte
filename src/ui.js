// Shared UI helpers used by every view.
import gsap from 'gsap';

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const img = (src, alt = '', cls = '', eager = false) =>
  src ? `<img src="${src}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''} />` : '';
export const waLink = (href, msg) => (msg && /wa\.me\//.test(href) && !/\/c\//.test(href) ? `${href}?text=${encodeURIComponent(msg)}` : href);
export const fmtNum = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.0', '')}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n ?? ''));

export const icons = {
  wa: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6.6 3h3l1.5 4.5-2 1.2a11 11 0 0 0 6.2 6.2l1.2-2 4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
  sound: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  mute: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.6-.3-3.9-1.1v5.7c0 7.2-7.9 9.5-11.1 4.3-2.1-3.4-.8-9.3 5.9-9.5v3.2c-.5.1-1.1.2-1.6.4-1.5.5-2.3 1.4-2.1 3 .5 3.1 6.2 4 5.7-2.1V3z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21z"/></svg>',
};

/** Monogram badge for places without a logo. */
export const monogram = (name) => `<span class="logo-badge logo-badge--word" aria-hidden="true"><span>${esc(name)}</span></span>`;
export const logoBadge = (src, name, cls = '') => (src ? `<img class="logo-badge ${cls}" src="${src}" alt="${esc(name)} logo" loading="lazy" />` : monogram(name));

/**
 * Video card: always shows its poster immediately (no black frames), plays
 * muted on hover / when visible, tap toggles sound.
 */
export function videoCard(v, { cls = '', label = '', autoplay = 'visible' } = {}) {
  const embed = !v.src && v.embed ? ` data-embed="${v.embed}"` : '';
  return `<figure class="vcard ${cls}${embed ? ' vcard--embed' : ''}" data-vcard data-autoplay="${autoplay}"${embed}>
    ${v.poster ? `<img class="vcard__poster" src="${v.poster}" alt="" loading="lazy" decoding="async" />` : ''}
    ${v.src ? `<video muted loop playsinline preload="none" ${v.poster ? `poster="${v.poster}"` : ''} data-src="${v.src}"></video>` : ''}
    <span class="vcard__shade" aria-hidden="true"></span>
    ${label ? `<figcaption class="vcard__cap">${label}</figcaption>` : ''}
    ${v.src ? `<button class="vcard__sound" aria-label="Activar sonido">${icons.mute}</button>` : ''}
    ${embed ? `<button class="vcard__play" aria-label="Reproducir video">${icons.play}</button>` : ''}
    ${v.href ? `<a class="vcard__link" href="${v.href}" target="_blank" rel="noopener" aria-label="Ver en ${v.tiktok ? 'TikTok' : 'Instagram'}">${v.tiktok ? icons.tiktok : icons.instagram}</a>` : ''}
  </figure>`;
}

/** Wire every video card in scope: lazy-load src, play while visible. */
export function bindVideos(scope = document) {
  const cards = $$('[data-vcard]', scope).filter((c) => !c.dataset.bound);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const card = e.target;
    const v = $('video', card);
    if (!v) return;
    if (e.isIntersecting) {
      if (!v.src) v.src = v.dataset.src;
      if (!reduced && card.dataset.autoplay === 'visible') v.play().then(() => card.classList.add('is-playing')).catch(() => {});
    } else { v.pause(); }
  }), { threshold: 0.35, rootMargin: '120px 0px' });
  cards.forEach((card) => {
    card.dataset.bound = '1';
    if (card.dataset.embed) {
      $('.vcard__play', card)?.addEventListener('click', () => {
        card.classList.add('is-embedded');
        card.insertAdjacentHTML('beforeend', `<iframe src="https://www.tiktok.com/player/v1/${card.dataset.embed}?autoplay=1&rel=0&description=0&music_info=0" allow="autoplay; fullscreen; encrypted-media" title="Video de TikTok de Ventura Mall"></iframe>`);
      });
    }
    const v = $('video', card);
    if (!v) return;
    io.observe(card);
    v.addEventListener('playing', () => card.classList.add('is-playing'));
    if (card.dataset.autoplay === 'hover') {
      card.addEventListener('pointerenter', () => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); });
      card.addEventListener('pointerleave', () => { if (v.muted) v.pause(); });
    }
    const sound = $('.vcard__sound', card);
    sound?.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (!v.src) v.src = v.dataset.src;
      // only one video with sound at a time
      $$('[data-vcard] video').forEach((o) => { if (o !== v && !o.muted) { o.muted = true; const b = $('.vcard__sound', o.closest('[data-vcard]')); if (b) b.innerHTML = icons.mute; } });
      v.muted = !v.muted;
      if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
      sound.innerHTML = v.muted ? icons.mute : icons.sound;
      sound.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar');
    });
  });
  return () => io.disconnect();
}

/** 3D tilt cards with moving glare. */
export function bindTilt(scope = document) {
  if (!finePointer || reduced) return;
  $$('[data-tilt]', scope).forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 10);
      rx((0.5 - py) * 9);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
    el.addEventListener('pointerleave', () => { rx(0); ry(0); el.classList.remove('is-tilting'); });
  });
}

/** Magnetic buttons. */
export function bindMagnetic(scope = document) {
  if (!finePointer || reduced) return;
  $$('[data-magnetic]', scope).forEach((el) => {
    if (el.dataset.magBound) return;
    el.dataset.magBound = '1';
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

// ── Lightbox ─────────────────────────────────────────────────
let lb = null;
let lbItems = [];
let lbIndex = 0;
function lbShow() {
  const it = lbItems[lbIndex];
  $('img', lb).src = it.src;
  $('figcaption', lb).textContent = it.title || '';
  $('.lightbox__count', lb).textContent = `${lbIndex + 1} / ${lbItems.length}`;
  gsap.fromTo($('img', lb), { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' });
}
function lbGo(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbShow(); }
export function closeLightbox() { if (!lb) return; lb.classList.remove('is-open'); document.documentElement.classList.remove('has-lightbox'); }
export function openLightbox(items, index = 0) {
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galería');
    lb.innerHTML = `<button class="lightbox__close" aria-label="Cerrar">×</button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Anterior">‹</button>
      <figure class="lightbox__fig"><img alt="" /><figcaption></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Siguiente">›</button>
      <span class="lightbox__count"></span>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.closest('.lightbox__close')) closeLightbox();
      else if (e.target.closest('.lightbox__nav--prev')) lbGo(-1);
      else if (e.target.closest('.lightbox__nav--next')) lbGo(1);
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbGo(-1);
      if (e.key === 'ArrowRight') lbGo(1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1); });
  }
  lbItems = items;
  lbIndex = index;
  lbShow();
  lb.classList.add('is-open');
  document.documentElement.classList.add('has-lightbox');
  $('.lightbox__close', lb).focus();
}

/** Bolivia time (UTC-4, no DST). */
export function boliviaNow() {
  const bo = new Date(Date.now() - 4 * 3600 * 1000);
  return { day: bo.getUTCDay(), hour: bo.getUTCHours() + bo.getUTCMinutes() / 60 };
}
export function mallOpen() {
  const { day, hour } = boliviaNow();
  const opens = day === 0 ? 11 : 10;
  return { open: hour >= opens && hour < 22, opens };
}
