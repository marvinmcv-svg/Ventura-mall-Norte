import { catById, coverOf, logoOf } from '../content.js';
import { esc, img, icons, logoBadge, waLink } from '../ui.js';

/** Store card: real photo, real logo, links to /tiendas/:slug. */
export function storeCard(s) {
  const cover = coverOf(s);
  return `<article class="store" data-tilt data-cat="${s.cat}">
    <div class="store__media">
      ${cover ? img(cover, `${s.name} en Ventura Mall`) : `<div class="store__mono"><span>${esc(s.name)}</span></div>`}
      <span class="store__more" aria-hidden="true">Ver tienda ${icons.arrow}</span>
    </div>
    <div class="store__body">
      ${logoBadge(logoOf(s), s.name, 'store__logo')}
      <div class="store__id">
        <h3><a class="stretched" href="/tiendas/${s.slug}">${esc(s.name)}</a></h3>
        <span>${esc(catById[s.cat].name)}${s.where ? ` · ${esc(s.where)}` : ''}</span>
      </div>
    </div>
    <i class="glare" aria-hidden="true"></i>
  </article>`;
}

/** Restaurant card: every one has a real dish/venue photo and its own logo. */
export function restaurantCard(r, size = '') {
  const cover = coverOf(r);
  const msg = `Hola ${r.name}, quiero hacer una reserva (vengo desde venturamall.bo).`;
  return `<article class="blv-card${size ? ` blv-card--${size}` : ''}" data-tilt>
    ${cover ? img(cover, `${r.name} — ${r.cuisine}`, 'blv-card__img') : ''}
    <div class="blv-card__body">
      ${logoBadge(logoOf(r), r.name, 'blv-card__logo')}
      <h3><a class="stretched" href="/boulevard/${r.slug}">${esc(r.name)}</a></h3>
      <p>${esc(r.cuisine)}</p>
      <div class="blv-card__actions">
        ${r.wa ? `<a class="pill pill--wa" href="${waLink(r.wa, msg)}" target="_blank" rel="noopener">${icons.wa}Reservar</a>` : ''}
        <span class="pill pill--ghost" aria-hidden="true">Ver menú ${icons.arrow}</span>
      </div>
    </div>
    <i class="glare" aria-hidden="true"></i>
  </article>`;
}
