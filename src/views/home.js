import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mall, categories, stores, restaurants, events, experiences, heroSlides, tiktoks, mallReels, catById, url, post, postImage, refImage, mallPhoto, logoOf, coverOf } from '../content.js';
import { $, $$, esc, img, icons, reduced, bindTilt, bindVideos, videoCard, logoBadge, fmtNum, waLink, reveal, isPhone, srcset, bgSrc } from '../ui.js';
import { storeCard, restaurantCard } from './cards.js';
import { splitChars, splitWords } from '../split.js';

// The stores shown on the home page teaser (the rest live on /tiendas)
const FEATURED = ['boss', 'armani-exchange', 'calvin-klein', 'mango', 'levis', 'forever-21', 'carrasco', 'opticas-pauker', 'kids-collection', 'mariposa'];
// TikTok rail: alternate viral classics with recent store videos for variety
function tiktokMix() {
  const viral = tiktoks.filter((t) => t.plays > 500000);
  const recent = tiktoks.filter((t) => t.plays <= 500000).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const out = [];
  while ((viral.length || recent.length) && out.length < 14) {
    if (recent.length) out.push(recent.shift());
    if (viral.length) out.push(viral.shift());
  }
  return out;
}

export function homeView() {
  const fmt = new Intl.NumberFormat('es-BO');
  const factsBg = mallPhoto('mall-interior') || mallPhoto('mall-2');
  const tts = tiktokMix();
  const reels = mallReels.slice(0, 10);

  const html = `
  <section class="hero" aria-label="Inicio">
    <div class="hero__slides" aria-hidden="true">
      ${heroSlides.map((h, i) => `<figure class="hero__slide"><img src="${url(h.src)}" srcset="${srcset(url(h.src))}" sizes="100vw" alt="" style="object-position:${h.pos}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" /></figure>`).join('')}
    </div>
    <canvas class="hero__canvas" aria-hidden="true"></canvas>
    <div class="hero__glow" aria-hidden="true"></div>
    <h1 class="sr-only">Ventura Mall — Santa Cruz de la Sierra</h1>
    <div class="hero__content">
      <p class="hero__eyebrow" data-hero-fade>Av. San Martín & 4to Anillo · Santa Cruz de la Sierra</p>
      <p class="hero__title" aria-label="Vivílo en grande">
        <span class="line"><span class="split">Vivílo</span></span>
        <span class="line"><span class="split serif">en grande</span></span>
      </p>
    </div>
    <div class="hero__bottom" data-hero-fade>
      <p>Somos el mall que Bolivia prefiere.<br />Moda, el Boulevard, cine y música en vivo.</p>
      <div class="hero__ctas">
        <a class="btn btn--sm" href="/tiendas" data-magnetic><span>Ver tiendas</span>${icons.arrow}</a>
        <a class="btn btn--ghost btn--sm" href="/boulevard" data-magnetic><span>El Boulevard</span></a>
      </div>
      <div class="hero__scroll"><span>Scroll</span><i></i></div>
    </div>
    <div class="hero__carousel" data-hero-fade>
      <p class="hero__caption" aria-live="polite"><span>01</span><b>${esc(heroSlides[0].caption)}</b></p>
      <div class="hero__dots" role="tablist" aria-label="Fotos del mall">
        ${heroSlides.map((h, i) => `<button role="tab" aria-selected="${!i}" aria-label="${esc(h.caption)}" data-slide="${i}"><i></i></button>`).join('')}
      </div>
    </div>
  </section>

  <section class="manifesto">
    <p class="kicker">( El mall )</p>
    <p class="manifesto__text" data-words>
      Más que un centro comercial, Ventura es el punto de encuentro de Santa Cruz. Las marcas que amas, los sabores del Boulevard y las noches de Ruta Boulevard — bajo un mismo techo, en Equipetrol Norte.
    </p>
  </section>

  <section class="facts" aria-label="Ventura Mall en cifras">
    ${factsBg ? `<div class="facts__bg" style="background-image:url('${bgSrc(factsBg)}')" aria-hidden="true"></div>` : ''}
    <div class="facts__head">
      <p class="kicker">( En cifras )</p>
      <h2 data-reveal>El más grande <span class="serif">de Bolivia</span></h2>
    </div>
    <div class="facts__grid">
      ${mall.facts.map((f) => `<div class="fact" data-tilt>
        <b data-counter="${f.value}" data-plain="${f.plain ? 1 : ''}" data-suffix="${esc(f.suffix || '')}">${f.plain ? f.value : fmt.format(f.value) + (f.suffix || '')}</b>
        <span>${esc(f.label)}</span><i class="glare" aria-hidden="true"></i>
      </div>`).join('')}
    </div>
    <p class="facts__src">Fuente: Wikipedia · Ventura Mall</p>
  </section>

  <section class="hscroll" aria-label="Categorías">
    <div class="hscroll__pin">
      <div class="hscroll__head">
        <p class="kicker">( Explora )</p>
        <h2>Un recorrido <span class="serif">sin fin</span></h2>
      </div>
      <div class="hscroll__track">
        ${categories.map((c) => {
          const n = c.id === 'gastronomia' ? restaurants.length + stores.filter((s) => s.cat === c.id).length : stores.filter((s) => s.cat === c.id).length;
          const href = c.href || `/tiendas?cat=${c.id}`;
          const members = c.id === 'gastronomia' ? [...restaurants, ...stores.filter((s) => s.cat === c.id)] : stores.filter((s) => s.cat === c.id);
          const shown = members.slice(0, 6);
          return `<a class="cat" href="${href}" data-cursor="Ver">
            <div class="cat__media" data-tilt>
              <span class="cat__num">${c.kicker}</span>
              <span class="cat__count">${n} locales</span>
              ${img(refImage(c.cover), c.name, '', false, '(max-width: 760px) 86vw, 44vw') || '<div class="cat__fallback"></div>'}
              <div class="cat__logos" title="${esc(members.map((m) => m.name).join(' · '))}">
                ${shown.map((m) => logoBadge(logoOf(m), m.name, 'cat__logo')).join('')}${members.length > shown.length ? `<span class="cat__more">+${members.length - shown.length}</span>` : ''}
              </div>
              <i class="glare" aria-hidden="true"></i>
            </div>
            <h3>${esc(c.name)}</h3>
            <p>${esc(c.blurb)}</p>
          </a>`;
        }).join('')}
      </div>
      <div class="hscroll__progress"><i></i></div>
    </div>
  </section>

  <section class="featured" id="tiendas">
    <div class="section-head">
      <div>
        <p class="kicker">( Directorio )</p>
        <h2 data-reveal>Nuestras <span class="serif">tiendas</span></h2>
      </div>
      <a class="link-arrow" href="/tiendas" data-magnetic>Ver las ${stores.length} tiendas ${icons.arrow}</a>
    </div>
    <div class="store-grid" data-stagger>
      ${FEATURED.map((s) => stores.find((x) => x.slug === s)).filter(Boolean).map(storeCard).join('')}
    </div>
  </section>

  <section class="blv" id="boulevard">
    <div class="section-head">
      <div>
        <p class="kicker">( Boulevard de Luz )</p>
        <h2 data-reveal>Sabores que <span class="serif">reúnen</span></h2>
      </div>
      <div class="section-head__side">
        <p class="lead">Lun–Dom de 11:00 a 23:00, con locales que abren desde las 7:00 o cierran hasta las 3:00. Reservá directo por WhatsApp.</p>
        <a class="link-arrow" href="/boulevard" data-magnetic>Ver todo el Boulevard ${icons.arrow}</a>
      </div>
    </div>
    <div class="blv-grid" data-stagger>
      ${restaurants.map((r, i) => restaurantCard(r, i < 2 ? 'big' : i < 4 ? 'wide' : '')).join('')}
    </div>
  </section>

  ${reels.length ? `<section class="reels-sec" aria-label="Reels de Instagram">
    <div class="section-head section-head--tight">
      <div><p class="kicker">( Reels · @venturamalloficial )</p><h2 class="h2--sm" data-reveal>Pasa en <span class="serif">Ventura</span></h2></div>
      <a class="link-arrow" href="${mall.socials.instagram.url}" target="_blank" rel="noopener">${icons.instagram} ${mall.socials.instagram.handle}</a>
    </div>
    <div class="rail" data-rail>
      ${reels.map((r) => videoCard({ src: url(r.video), poster: url(r.images?.[0] || r.poster), href: `https://www.instagram.com/p/${r.code}/` }, { cls: 'vcard--reel', autoplay: 'hover' })).join('')}
    </div>
  </section>` : ''}

  <section class="events" id="eventos">
    <div class="section-head">
      <div>
        <p class="kicker">( Ruta Boulevard )</p>
        <h2 data-reveal>Música <span class="serif">en vivo</span></h2>
      </div>
    </div>
    <div class="events__grid" data-stagger>
      ${events.map((e) => `<article class="event" data-tilt>
        <div class="event__media">${img(postImage(e.post), e.title) || '<div class="cat__fallback"></div>'}</div>
        <div class="event__body">
          <span class="event__when">${esc(e.when)} · ${esc(e.where)}</span>
          <h3>${esc(e.title)}</h3>
          <p>${esc(e.text)}</p>
        </div>
        <i class="glare" aria-hidden="true"></i>
      </article>`).join('')}
    </div>
  </section>

  <section class="exp" id="experiencias">
    <div class="section-head">
      <div>
        <p class="kicker">( Experiencias )</p>
        <h2 data-reveal>Para quedarse <span class="serif">un rato más</span></h2>
      </div>
    </div>
    <div class="exp__stack">
      ${experiences.map((e, i, a) => {
        const src = e.mall ? mallPhoto(e.mall) : postImage(e.post, e.i);
        return src ? `<article class="exp-card">
          ${img(src, e.title)}
          <span class="exp-card__num">${String(i + 1).padStart(2, '0')} / ${String(a.length).padStart(2, '0')}</span>
          <div class="exp-card__body"><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div>
        </article>` : '';
      }).join('')}
    </div>
  </section>

  ${tts.length ? `<section class="tiktok" aria-label="TikTok">
    <div class="section-head">
      <div>
        <p class="kicker">( TikTok · ${mall.socials.tiktok.followers} seguidores )</p>
        <h2 data-reveal>Lo más visto <span class="serif">en TikTok</span></h2>
      </div>
      <a class="link-arrow" href="${mall.socials.tiktok.url}" target="_blank" rel="noopener">${icons.tiktok} ${mall.socials.tiktok.handle}</a>
    </div>
    <div class="rail rail--tt" data-rail>
      ${tts.map((t) => videoCard({ src: url(t.video), poster: url(t.poster), embed: t.id, href: `https://www.tiktok.com/@venturamalloficial/video/${t.id}`, tiktok: true },
        { cls: 'vcard--tt', autoplay: 'hover', label: `<b>${fmtNum(t.plays)} vistas</b><span>${esc((t.desc || '').replace(/#\S+/g, '').replace(/@\S+/g, '').trim().slice(0, 70))}</span>` })).join('')}
    </div>
  </section>` : ''}

  <section class="social" aria-label="Instagram">
    <div class="social__ring" aria-hidden="true" data-ring></div>
    <div class="social__copy">
      <p class="kicker">( Comunidad )</p>
      <h2>Seguinos <span class="serif">#VivíloEnGrande</span></h2>
      <div class="social__btns">${socialButtons()}</div>
    </div>
  </section>

  <section class="visit" id="visita">
    <div class="visit__info">
      <p class="kicker">( Visítanos )</p>
      <h2 data-reveal>Te esperamos <span class="serif">hoy</span></h2>
      <dl class="hours">${mall.hours.map((h) => `<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('')}</dl>
      <address>${esc(mall.address)}<br />${esc(mall.city)}</address>
      <p class="visit__contact"><a href="${mall.phoneHref}">${esc(mall.phone)}</a> · <a href="mailto:${mall.email}">${esc(mall.email)}</a></p>
      <div class="visit__actions">
        <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${mall.coords.lat},${mall.coords.lng}" data-magnetic><span>Cómo llegar</span>${icons.arrow}</a>
        <button class="btn btn--ghost" data-open-funnel data-magnetic><span>Escribinos por WhatsApp</span></button>
      </div>
    </div>
    <div class="visit__map">
      <a class="visit__map-fallback" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mall.mapsQuery)}"><span>Ver en Google Maps ↗</span></a>
      <iframe title="Mapa de Ventura Mall" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mall.coords.lat},${mall.coords.lng}&z=16&output=embed"></iframe>
    </div>
  </section>`;

  return {
    page: 'home',
    title: 'Ventura Mall — Somos el mall que Bolivia prefiere',
    description: 'Ventura Mall, Av. San Martín y 4to Anillo, Equipetrol Norte, Santa Cruz de la Sierra. Moda internacional, el Boulevard, 13 salas de cine y Ruta Boulevard con música en vivo.',
    html,
    mount({ main, first }) {
      const cleanups = [];
      cleanups.push(bindVideos(main));
      bindTilt(main);
      cleanups.push(initRails(main));
      const ring = isPhone ? null : renderRing(main);

      // hero intro: chars rise once the loader (or the page curtain) is gone
      const heroChars = $$('.hero__title .split', main).flatMap(splitChars);
      const heroFade = $$('[data-hero-fade]', main);
      let hero = null;
      let alive = true;
      Promise.all([import('../hero.js'), document.fonts.load('800 300px Syne').catch(() => {})]).then(([{ createHero }]) => {
        if (!alive) return;
        try { hero = createHero($('.hero__canvas', main)); } catch (err) { console.warn('WebGL unavailable', err); return; }
        gsap.to(hero.uniforms.uAssemble, { value: 1, duration: 3.2, ease: 'power3.inOut', delay: first ? 1.6 : 0.3 });
        ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (hero.uniforms.uScroll.value = s.progress) });
      });
      cleanups.push(() => { alive = false; hero?.destroy(); });

      if (!reduced) {
        gsap.set(heroChars, { yPercent: 110 });
        gsap.set(heroFade, { opacity: 0, y: 20 });
        const d = first ? 2.3 : 0.4;
        gsap.fromTo('.hero__slides', { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: 'expo.out', delay: d - 0.6 });
        gsap.to(heroChars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.03, delay: d });
        gsap.to(heroFade, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: d + 0.3 });
        setupScroll(main, ring);
      } else {
        gsap.set('.hero__slides', { opacity: 1 });
      }
      cleanups.push(heroCarousel(main, first));
      return () => cleanups.forEach((c) => c?.());
    },
  };
}

/**
 * Hero carousel: slow crossfade with a Ken Burns drift, one photo every ~6.5s.
 * Pauses while the hero is off-screen or the tab is hidden; dots jump to a photo.
 */
function heroCarousel(main, first) {
  const slides = $$('.hero__slide', main);
  const dots = $$('[data-slide]', main);
  const cap = $('.hero__caption', main);
  if (slides.length < 2) return null;
  const HOLD = reduced ? 9 : 6.5; // seconds each photo stays
  const FADE = reduced ? 0.01 : 1.8;
  let cur = 0;
  let timer = null;
  let drift = null;
  let visible = true;
  const kenBurns = (el, i) => {
    if (drift) drift.kill();
    if (reduced) return;
    const dir = i % 2 ? 1 : -1;
    drift = gsap.fromTo($('img', el), { scale: 1.16, xPercent: -2 * dir }, { scale: 1.02, xPercent: 2 * dir, duration: HOLD + FADE + 1, ease: 'none' });
  };
  const progress = (i) => {
    dots.forEach((d, k) => {
      d.setAttribute('aria-selected', String(k === i));
      gsap.killTweensOf($('i', d));
      gsap.set($('i', d), { scaleX: k < i ? 1 : 0 });
    });
    if (!reduced) gsap.fromTo($('i', dots[i]), { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: 'none' });
  };
  const caption = (i) => {
    cap.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span><b>${esc(heroSlides[i].caption)}</b>`;
    if (!reduced) gsap.fromTo(cap.children, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06 });
  };
  const stop = () => { if (timer) timer.kill(); timer = null; };
  const schedule = () => { stop(); timer = gsap.delayedCall(HOLD, () => go(cur + 1)); };
  function go(n) {
    n = (n + slides.length) % slides.length;
    if (n === cur) return schedule();
    const prev = slides[cur];
    const next = slides[n];
    gsap.set(prev, { zIndex: 1 });
    gsap.set(next, { zIndex: 2 });
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: FADE, ease: 'power2.inOut', onComplete: () => gsap.set(prev, { opacity: 0 }) });
    kenBurns(next, n);
    cur = n;
    progress(n);
    caption(n);
    if (visible && !document.hidden) schedule();
  }
  gsap.set(slides, { opacity: 0, zIndex: 0 });
  gsap.set(slides[0], { opacity: 1, zIndex: 2 });
  kenBurns(slides[0], 0);
  // the first photo gets extra time while the intro plays
  const start = gsap.delayedCall(first ? 2.4 : 0.4, () => { progress(0); schedule(); });
  dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.slide)));
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !document.hidden) schedule(); else stop();
    if (drift) drift[visible ? 'resume' : 'pause']();
  });
  io.observe($('.hero', main));
  const onVis = () => (document.hidden ? stop() : visible && schedule());
  document.addEventListener('visibilitychange', onVis);
  return () => { start.kill(); stop(); if (drift) drift.kill(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
}

function socialButtons() {
  return Object.entries(mall.socials)
    .map(([k, s]) => `<a class="btn btn--sm" href="${s.url}" target="_blank" rel="noopener" data-magnetic>${icons[k]}<span>${k === 'facebook' ? 'Facebook' : s.handle}${s.followers ? ` · ${s.followers}` : ''}</span></a>`)
    .join('');
}

function renderRing(main) {
  // a varied ring: one cover per store / restaurant
  const srcs = [];
  for (const s of [...stores, ...restaurants]) { const c = coverOf(s); if (c && !srcs.includes(c)) srcs.push(c); }
  const list = srcs.slice(0, 18);
  if (list.length < 6) return null;
  const n = list.length;
  const radius = Math.max(560, window.innerWidth * 0.44);
  const ring = document.createElement('div');
  ring.className = 'ring';
  ring.innerHTML = list.map((src, i) => `<figure style="transform: rotateY(${(360 / n) * i}deg) translateZ(${radius}px)"><img src="${src}" alt="" loading="lazy" /></figure>`).join('');
  $('[data-ring]', main).appendChild(ring);
  return ring;
}

/** Horizontal rails: drag to scroll on desktop, native swipe on touch. */
export function initRails(main) {
  const offs = [];
  $$('[data-rail]', main).forEach((rail) => {
    let down = false, sx = 0, sl = 0, moved = false;
    const md = (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); };
    const mm = (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; };
    const mu = () => { down = false; rail.classList.remove('is-drag'); };
    const click = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
    rail.addEventListener('pointerdown', md);
    window.addEventListener('pointermove', mm);
    window.addEventListener('pointerup', mu);
    rail.addEventListener('click', click, true);
    offs.push(() => { window.removeEventListener('pointermove', mm); window.removeEventListener('pointerup', mu); });
  });
  return () => offs.forEach((f) => f());
}

function setupScroll(main, ring) {
  gsap.to('.hero__content', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__slides', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // manifesto: words light up as you read
  gsap.to(splitWords($('[data-words]', main)), { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 55%', scrub: true } });

  // facts
  gsap.fromTo('.facts__bg', { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: '.facts', start: 'top bottom', end: 'bottom top', scrub: true } });
  reveal($$('.fact', main), { stagger: 0.1, kind: 'flip' });
  const fmt = new Intl.NumberFormat('es-BO');
  $$('[data-counter]', main).forEach((el) => {
    const end = +el.dataset.counter;
    const plain = !!el.dataset.plain;
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        const o = { v: plain ? end - 12 : 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = (plain ? Math.round(o.v) : fmt.format(Math.round(o.v))) + (el.dataset.suffix || '')) });
      },
    });
  });

  // horizontal categories (pinned) — only where there is room for it
  const mmq = gsap.matchMedia();
  mmq.add('(min-width: 761px)', () => {
    const track = $('.hscroll__track', main);
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const htween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.hscroll', pin: '.hscroll__pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true } });
    gsap.to('.hscroll__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.hscroll', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });
    $$('.cat', main).forEach((card) => {
      const im = $('.cat__media > img', card);
      if (im) gsap.fromTo(im, { xPercent: -3 }, { xPercent: 3, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: htween, start: 'left right', end: 'right left', scrub: true } });
    });
  });

  // headings + staggered card grids
  reveal($$('[data-reveal]', main), { stagger: 0 });
  revealGrids(main);

  // reels / tiktok rails drift in
  $$('[data-rail]', main).forEach((r) => reveal([...r.children].slice(0, 6), { stagger: 0.06, group: 6, kind: 'side' }));

  // stacked experience cards
  const cards = $$('.exp-card', main);
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    // phones: scale only (animating a CSS filter on a full-screen photo is expensive)
    gsap.to(card, { scale: 0.92, ...(isPhone ? {} : { filter: 'brightness(0.45)' }), ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true } });
  });

  if (ring) gsap.fromTo(ring, { rotateY: 0, rotateX: -8 }, { rotateY: -200, rotateX: 8, ease: 'none', scrollTrigger: { trigger: '.social', start: 'top bottom', end: 'bottom top', scrub: 1 } });
}

/** Cards rise in 3D as their grid enters the viewport (used by every page). */
export function revealGrids(main) {
  $$('[data-stagger]', main).forEach((grid) => reveal(grid.children, { stagger: 0.07, group: 4 }));
}
