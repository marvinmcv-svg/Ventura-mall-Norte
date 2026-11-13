import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mall, categories, brands, experiences } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

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
    if (href.length < 2 && href !== '#top') return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    $('.nav__burger').setAttribute('aria-expanded', 'false');
    scrollTo(href);
  })
);

// ── Helpers ──────────────────────────────────────────────────
function splitChars(el) {
  // chars are grouped per word so lines only break between words
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

const arrow = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

// ── Content rendering ────────────────────────────────────────
function renderMarquee() {
  const names = brands.map((b) => b.name);
  $$('[data-marquee]').forEach((track, i) => {
    const list = i ? [...names].reverse() : names;
    const html = list.map((n) => `<span>${n}<i></i></span>`).join('');
    track.innerHTML = html + html; // duplicated for seamless loop
  });
}

function renderCategories() {
  $('[data-categories]').innerHTML = categories
    .map((c) => {
      const count = brands.filter((b) => b.cat === c.id).length;
      return `<article class="cat" data-cursor="Ver" data-cat-link="${c.id}">
        <div class="cat__media">
          <span class="cat__num">${c.kicker}</span>
          <span class="cat__count">${count} marcas</span>
          <img src="${c.image}" alt="" loading="lazy" />
        </div>
        <h3>${c.name}</h3>
        <p>${c.blurb}</p>
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
      return `<button class="chip" role="tab" aria-selected="${c.id === activeCat}" data-chip="${c.id}">${c.name}<sup>${n}</sup></button>`;
    })
    .join('');
}

function renderBrands(animate = true) {
  const q = query.trim().toLowerCase();
  const list = brands
    .filter((b) => activeCat === 'all' || b.cat === activeCat)
    .filter((b) => !q || b.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const ul = $('[data-brands]');
  ul.innerHTML = list
    .map(
      (b, i) => `<li class="brand" data-brand-cat="${b.cat}">
        <span class="brand__idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="brand__name">${b.logo ? `<img src="${b.logo}" alt="${b.name}" />` : b.name}</span>
        <span class="brand__cat">${catById[b.cat].name}</span>
        <span class="brand__arrow">${arrow}</span>
      </li>`
    )
    .join('');
  $('[data-empty]').hidden = list.length > 0;

  if (animate && !reduced) {
    gsap.fromTo(
      $$('.brand', ul),
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.025, overwrite: true }
    );
  }
  ScrollTrigger.refresh();
}

function setCategory(id) {
  activeCat = id;
  $$('[data-chip]').forEach((c) => c.setAttribute('aria-selected', String(c.dataset.chip === id)));
  renderBrands();
}

function renderGastro() {
  $('[data-gastro-list]').innerHTML = brands
    .filter((b) => b.cat === 'gastronomia')
    .map((b) => `<li>${b.name}</li>`)
    .join('');
}

function renderExperiences() {
  $('[data-exp]').innerHTML = experiences
    .map(
      (e, i) => `<article class="exp-card">
        <img src="${e.image}" alt="" loading="lazy" />
        <span class="exp-card__num">${String(i + 1).padStart(2, '0')} / ${String(experiences.length).padStart(2, '0')}</span>
        <div class="exp-card__body"><h3>${e.title}</h3><p>${e.text}</p></div>
      </article>`
    )
    .join('');
}

function renderRing() {
  const imgs = ['shopper', 'sneaker', 'coffee', 'rack-white', 'bar', 'beauty', 'sport-fashion', 'food', 'store-menswear', 'cocktail', 'storefront', 'rack-warm'];
  const n = imgs.length;
  const radius = Math.max(520, window.innerWidth * 0.42);
  const ring = document.createElement('div');
  ring.className = 'ring';
  ring.innerHTML = imgs
    .map((src, i) => `<figure style="transform: rotateY(${(360 / n) * i}deg) translateZ(${radius}px)"><img src="/media/${src}.jpg" alt="" loading="lazy" /></figure>`)
    .join('');
  $('[data-ring]').appendChild(ring);
  return ring;
}

function renderVisit() {
  $('[data-hours]').innerHTML = mall.hours.map((h) => `<div><dt>${h.label}</dt><dd>${h.value}</dd></div>`).join('');
  $('[data-address]').innerHTML = `${mall.address}<br />${mall.city}`;
  const q = encodeURIComponent(mall.mapsQuery);
  $('[data-map]').src = `https://www.google.com/maps?q=${q}&output=embed`;
  $('[data-directions]').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  $('[data-year]').textContent = new Date().getFullYear();

  // open/closed status in Bolivia time (UTC-4, no DST)
  const now = new Date();
  const boHour = (now.getUTCHours() - 4 + 24) % 24 + now.getUTCMinutes() / 60;
  const open = boHour >= 10 && boHour < 22;
  $('[data-open-status]').textContent = open ? 'Abierto ahora' : 'Abrimos 10:00';
  $('.nav__cta .dot').classList.toggle('is-closed', !open);
}

renderMarquee();
renderCategories();
renderChips();
renderBrands(false);
renderGastro();
renderExperiences();
const ring = renderRing();
renderVisit();

$('[data-chips]').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-chip]');
  if (chip) setCategory(chip.dataset.chip);
});
$('[data-search]').addEventListener('input', (e) => {
  query = e.target.value;
  renderBrands();
});
$('[data-categories]').addEventListener('click', (e) => {
  const card = e.target.closest('[data-cat-link]');
  if (!card) return;
  setCategory(card.dataset.catLink);
  scrollTo('#marcas');
});

// mobile menu
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
    const hoverable = e.target.closest('a, button, .brand, input');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-hover', !labelled && !!hoverable);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });

  $$('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.35);
      my((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });

  // floating category preview on brand rows
  const preview = $('.brand-preview');
  const pImg = $('img', preview);
  const px = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const py = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
  const list = $('[data-brands]');
  list.addEventListener('pointermove', (e) => {
    px(e.clientX + 30);
    py(e.clientY - 160);
    const row = e.target.closest('.brand');
    if (row) {
      const src = catById[row.dataset.brandCat].image;
      if (!pImg.src.endsWith(src)) pImg.src = src;
    }
  });
  list.addEventListener('pointerenter', () => gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }));
  list.addEventListener('pointerleave', () => gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.4 }));
}

// nav hides on scroll down
let lastY = 0;
ScrollTrigger.create({
  onUpdate: (self) => {
    const y = self.scroll();
    $('.nav').classList.toggle('is-hidden', y > lastY && y > 200);
    lastY = y;
  },
});

// scale the footer wordmark so it spans exactly the container width
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

  // wait for display font so the particle text samples the right glyphs
  const heroModule = import('./hero.js'); // three.js loads in parallel, in its own chunk
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);

  // the 800 weight is only used by the footer, so wait for it explicitly
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
  tl.to(counter, {
    v: 100,
    duration: reduced ? 0.2 : 1.8,
    ease: 'power2.inOut',
    onUpdate: () => ($('[data-count]').textContent = Math.round(counter.v)),
  })
    .to('.loader__inner', { opacity: 0, duration: 0.4 })
    .to('.loader__panel--top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .to('.loader__panel--bottom', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<')
    .add(() => {
      document.body.classList.remove('is-loading');
      $('.loader').remove();
      lenis?.start();
    })
    .to(heroChars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.025 }, '-=0.7')
    .to(heroFade, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, '<0.3');

  if (hero) {
    tl.to(hero.uniforms.uAssemble, { value: 1, duration: 3.2, ease: 'power3.inOut' }, 1.2);
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (s) => (hero.uniforms.uScroll.value = s.progress),
    });
  }

  if (!reduced) setupScroll();
  ScrollTrigger.refresh();
}

function setupScroll() {
  // hero content parallax out
  gsap.to('.hero__content', {
    yPercent: -40, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // marquee: infinite loop, scroll velocity speeds it up and flips direction
  const loops = $$('[data-marquee]').map((track) => {
    const rev = track.dataset.marquee === 'rev';
    return gsap.fromTo(track, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 40, ease: 'none', repeat: -1 });
  });
  let dir = 1;
  let velocity = 0;
  let speed = 1;
  let skew = 0;
  const skewSet = gsap.quickSetter('[data-marquee]', 'skewX', 'deg');
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      velocity = self.getVelocity();
      if (velocity) dir = Math.sign(velocity);
    },
  });
  gsap.ticker.add(() => {
    const targetSpeed = dir * (1 + Math.min(Math.abs(velocity) / 300, 6));
    speed += (targetSpeed - speed) * 0.1;
    skew += (gsap.utils.clamp(-10, 10, velocity / -250) - skew) * 0.1;
    velocity *= 0.9; // decay once scrolling stops
    loops.forEach((l) => l.timeScale(speed));
    skewSet(skew);
  });

  // manifesto words light up
  const words = splitWords($('[data-words]'));
  gsap.to(words, {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true },
  });

  // zoom reveal
  const rtl = gsap.timeline({
    scrollTrigger: { trigger: '.reveal', start: 'top top', end: 'bottom bottom', scrub: 1 },
  });
  rtl
    .to('.reveal__frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 })
    .to('.reveal__frame img', { scale: 1, ease: 'none', duration: 1 }, 0)
    .fromTo('.reveal__copy h2 span', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.4 }, 0.3)
    .fromTo('.stat', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.3 }, 0.75);

  $$('[data-counter]').forEach((el) => {
    const end = +el.dataset.counter;
    const fmt = new Intl.NumberFormat('es-BO');
    ScrollTrigger.create({
      trigger: '.reveal', start: '70% bottom', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = fmt.format(Math.round(o.v)) + (el.dataset.suffix || '')) });
      },
    });
  });

  // horizontal categories
  const track = $('.hscroll__track');
  const dist = () => track.scrollWidth - window.innerWidth;
  const htween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.hscroll', pin: '.hscroll__pin', start: 'top top',
      end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true,
    },
  });
  gsap.to('.hscroll__progress i', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.hscroll', start: 'top top', end: () => '+=' + dist(), scrub: true },
  });
  $$('.cat').forEach((card) => {
    gsap.fromTo($('img', card), { xPercent: -8 }, {
      xPercent: 8, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: htween, start: 'left right', end: 'right left', scrub: true },
    });
    gsap.from(card, {
      rotate: 4, y: 60, opacity: 0.3, ease: 'power2.out',
      scrollTrigger: { trigger: card, containerAnimation: htween, start: 'left 95%', end: 'left 55%', scrub: true },
    });
  });

  // section headings rise in
  $$('[data-reveal-lines]').forEach((h) => {
    gsap.from(h, { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // brand rows on first view
  ScrollTrigger.create({ trigger: '.brand-list', start: 'top 80%', once: true, onEnter: () => renderBrands(true) });

  // gastronomy parallax images
  $$('[data-parallax]').forEach((fig) => {
    const speed = parseFloat(fig.dataset.parallax);
    gsap.fromTo($('img', fig), { yPercent: -10 - speed * 40 }, {
      yPercent: -10 + speed * 40, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(fig, { clipPath: 'inset(100% 0 0 0 round 18px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: fig, start: 'top 85%' } });
  });
  gsap.from('.gastro__list li', {
    y: 20, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.gastro__list', start: 'top 85%' },
  });

  // stacked experience cards: earlier cards recede as the next one arrives
  const cards = $$('.exp-card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.9 - (cards.length - i) * 0.01, filter: 'brightness(0.45)', ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 10%', scrub: true },
    });
  });

  // 3D image ring
  gsap.fromTo(ring, { rotateY: 0, rotateX: -8 }, {
    rotateY: -200, rotateX: 8, ease: 'none',
    scrollTrigger: { trigger: '.social', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });

  // footer wordmark
  const markChars = splitChars($('[data-footer-mark]'));
  gsap.from(markChars, {
    yPercent: 100, opacity: 0, stagger: 0.05, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.footer', start: 'top 70%' },
  });
}

document.body.classList.add('is-loading');
boot();
