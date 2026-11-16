import gsap from 'gsap';
import { mall, restaurants, events, postImage, coverOf, logoOf } from '../content.js';
import { $, $$, esc, img, icons, reduced, bindTilt, bgSrc } from '../ui.js';
import { restaurantCard } from './cards.js';
import { pageHeroIntro } from './directory.js';
import { revealGrids } from './home.js';

export function boulevardView() {
  const bg = postImage('Dfp4sDXDj42', 1) || postImage('DfbUIfdDVTz', 0);
  const html = `
  <header class="page-hero page-hero--blv">
    ${bg ? `<div class="page-hero__bg" style="background-image:url('${bgSrc(bg)}')" aria-hidden="true"></div>` : ''}
    <div class="page-hero__inner">
      <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><span aria-current="page">Boulevard</span></nav>
      <h1 class="page-title"><span class="line"><span class="split">Boulevard</span></span><span class="line"><span class="split serif">de Luz</span></span></h1>
      <p class="page-lead">${restaurants.length} restaurantes y bares al aire libre: churrasco brasileño, cocina peruana y boliviana, steakhouse, burgers, cócteles y música en vivo. ${esc(mall.hours[2].value)}.</p>
      <div class="page-hero__actions">
        <button class="btn btn--wa" data-open-funnel data-magnetic>${icons.wa}<span>Reservar por WhatsApp</span></button>
        <a class="btn btn--ghost" href="/#eventos" data-magnetic><span>Ruta Boulevard</span></a>
      </div>
    </div>
  </header>

  <section class="blv-logos" aria-label="Restaurantes">
    ${restaurants.map((r) => `<a href="/boulevard/${r.slug}" class="blv-logos__item" title="${esc(r.name)}">${logoOf(r) ? `<img src="${logoOf(r)}" alt="${esc(r.name)}" loading="lazy" />` : `<span>${esc(r.name)}</span>`}</a>`).join('')}
  </section>

  <section class="blv blv--page">
    <div class="blv-grid" data-stagger>
      ${restaurants.map((r, i) => restaurantCard(r, i < 2 ? 'big' : i < 4 ? 'wide' : '')).join('')}
    </div>
  </section>

  <section class="events events--page">
    <div class="section-head">
      <div><p class="kicker">( Ruta Boulevard )</p><h2>Música <span class="serif">en vivo</span></h2></div>
    </div>
    <div class="events__grid" data-stagger>
      ${events.map((e) => `<article class="event" data-tilt>
        <div class="event__media">${img(postImage(e.post), e.title)}</div>
        <div class="event__body"><span class="event__when">${esc(e.when)} · ${esc(e.where)}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div>
        <i class="glare" aria-hidden="true"></i>
      </article>`).join('')}
    </div>
  </section>`;

  return {
    page: 'boulevard',
    title: 'Boulevard — Restaurantes en Ventura Mall',
    description: `El Boulevard de Ventura Mall: ${restaurants.map((r) => r.name).join(', ')}. Reservá por WhatsApp.`,
    html,
    mount({ main }) {
      bindTilt(main);
      pageHeroIntro(main);
      if (!reduced) {
        gsap.from('.blv-logos__item', { y: 30, opacity: 0, scale: 0.8, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.04, delay: 0.5 });
        revealGrids(main);
      }
    },
  };
}

export function notFoundView() {
  return {
    page: 'notfound',
    title: 'Página no encontrada — Ventura Mall',
    html: `<section class="notfound">
      <p class="kicker">( 404 )</p>
      <h1 class="page-title"><span class="line"><span class="split">Te perdiste</span></span><span class="line"><span class="split serif">en el mall</span></span></h1>
      <p class="page-lead">Esta página no existe, pero hay mucho para ver.</p>
      <div class="page-hero__actions"><a class="btn" href="/">Volver al inicio ${icons.arrow}</a><a class="btn btn--ghost" href="/tiendas">Ver tiendas</a></div>
    </section>`,
    mount({ main }) { pageHeroIntro(main); },
  };
}
