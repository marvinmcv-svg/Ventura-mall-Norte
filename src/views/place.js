// Detail page for a store (/tiendas/:slug) or a restaurant (/boulevard/:slug).
import gsap from 'gsap';
import { mall, stores, restaurants, catById, post, url, coverOf, logoOf, galleryOf, videosOf, account, captionTitle, captionBody, accountPosts } from '../content.js';
import { $, $$, esc, img, icons, reduced, bindTilt, bindVideos, videoCard, logoBadge, openLightbox, waLink, mallOpen, fmtNum, reveal, bgSrc } from '../ui.js';
import { storeCard, restaurantCard } from './cards.js';
import { pageHeroIntro } from './directory.js';
import { revealGrids, initRails } from './home.js';

const fmtDate = (d) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('es-BO', { day: 'numeric', month: 'long' }) : '');

export function placeView(kind, slug) {
  const isStore = kind === 'store';
  const list = isStore ? stores : restaurants;
  const x = list.find((s) => s.slug === slug);
  if (!x) return null;

  const base = isStore ? '/tiendas' : '/boulevard';
  const section = isStore ? 'Tiendas' : 'Boulevard';
  const cover = coverOf(x);
  const logo = logoOf(x);
  const acc = account(x.ig);
  const gallery = galleryOf(x, 16);
  const videos = videosOf(x).slice(0, 8);
  const news = isStore ? (x.posts || []).map((c) => ({ code: c, ...post(c) })).filter((p) => p.images?.length || p.poster) : accountPosts(x.ig).slice(0, 4);
  const { open } = mallOpen();
  const subtitle = isStore ? `${catById[x.cat].name}${x.where ? ` · ${x.where}` : ''}` : x.cuisine;
  const hours = x.hours || (isStore ? (x.cat === 'servicios' ? mall.hours[3].value : mall.hours[0].value) : mall.hours[2].value);
  const where = x.where ? `${x.where}, Ventura Mall` : isStore ? 'Ventura Mall' : 'Boulevard de Luz, Ventura Mall';
  const msg = isStore ? `Hola ${x.name}, tengo una consulta (vengo desde venturamall.bo).` : `Hola ${x.name}, quiero hacer una reserva (vengo desde venturamall.bo).`;
  const waHref = x.wa ? waLink(x.wa, msg) : x.whatsapp ? waLink(`https://wa.me/${x.whatsapp}`, msg) : null;
  const igUrl = x.ig ? `https://www.instagram.com/${x.ig}/` : null;
  const idx = list.indexOf(x);
  const next = list[(idx + 1) % list.length];
  const related = (isStore ? stores.filter((s) => s.cat === x.cat && s !== x) : restaurants.filter((r) => r !== x)).slice(0, 4);
  const relatedFill = related.length < 4 && isStore ? [...related, ...stores.filter((s) => s !== x && !related.includes(s))].slice(0, 4) : related;

  const actions = [
    waHref && `<a class="btn btn--wa" href="${waHref}" target="_blank" rel="noopener" data-magnetic>${icons.wa}<span>${isStore ? 'Escribir por WhatsApp' : 'Reservar por WhatsApp'}</span></a>`,
    x.catalog && `<a class="btn" href="${x.catalog}" target="_blank" rel="noopener" data-magnetic><span>Ver catálogo</span>${icons.arrow}</a>`,
    x.phone && `<a class="btn btn--ghost" href="tel:+591${x.phone}" data-magnetic>${icons.phone}<span>${x.phone.replace(/(\d{4})(\d+)/, '$1 $2')}</span></a>`,
    igUrl && `<a class="btn btn--ghost" href="${igUrl}" target="_blank" rel="noopener" data-magnetic>${icons.instagram}<span>@${esc(x.ig)}</span></a>`,
  ].filter(Boolean).join('');

  const html = `
  <header class="page-hero page-hero--place">
    ${cover ? `<div class="page-hero__bg" style="background-image:url('${bgSrc(cover)}')" aria-hidden="true"></div>` : '<div class="page-hero__bg page-hero__bg--grad" aria-hidden="true"></div>'}
    <div class="page-hero__inner">
      <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><a href="${base}">${section}</a><span>/</span><span aria-current="page">${esc(x.name)}</span></nav>
      <div class="place-id">
        ${logoBadge(logo, x.name, 'place-id__logo')}
        <div>
          <p class="page-hero__meta"><span class="status ${open ? '' : 'is-closed'}"><i class="dot${open ? '' : ' is-closed'}"></i>${open ? 'Abierto ahora' : 'Cerrado ahora'}</span> ${esc(subtitle)}</p>
          <h1 class="page-title page-title--place"><span class="line"><span class="split">${esc(x.name)}</span></span></h1>
        </div>
      </div>
      <div class="page-hero__actions">${actions}</div>
    </div>
  </header>

  <section class="place-info">
    <div class="info-card">${icons.pin}<span>Ubicación</span><b>${esc(where)}</b><a href="https://www.google.com/maps/dir/?api=1&destination=${mall.coords.lat},${mall.coords.lng}" target="_blank" rel="noopener">Cómo llegar ↗</a></div>
    <div class="info-card">${icons.clock}<span>Horario</span><b>${esc(hours)}</b></div>
    <div class="info-card">${icons.phone}<span>${isStore ? 'Contacto' : 'Reservas'}</span><b>${x.phone ? `+591 ${x.phone}` : x.whatsapp ? `WhatsApp +${x.whatsapp}` : x.wa ? 'WhatsApp del local' : mall.phone}</b>${waHref ? `<a href="${waHref}" target="_blank" rel="noopener">Escribir ↗</a>` : `<a href="${mall.phoneHref}">Llamar al mall</a>`}</div>
    <div class="info-card">${icons.instagram}<span>Redes</span><b>${x.ig ? `@${esc(x.ig)}` : '@venturamalloficial'}</b>${acc?.followers ? `<a href="${igUrl}" target="_blank" rel="noopener">${fmtNum(acc.followers)} seguidores ↗</a>` : ''}</div>
  </section>

  <section class="place-about">
    <p class="kicker">( ${isStore ? 'Sobre la marca' : 'La casa'} )</p>
    <p class="place-about__text">${esc(x.about)}</p>
    ${x.lines?.length || x.menu?.length ? `<div class="place-about__tags">
      <span>${isStore ? 'Qué encontrás' : 'Para probar'}</span>
      <ul>${(x.lines || x.menu).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    </div>` : ''}
  </section>

  ${news.length ? `<section class="place-news">
    <div class="section-head section-head--tight"><div><p class="kicker">( ${isStore ? 'Novedades en Ventura' : 'Lo último'} )</p><h2 class="h2--sm">${isStore ? 'Promos y <span class="serif">lanzamientos</span>' : 'Recién salido <span class="serif">de la cocina</span>'}</h2></div></div>
    <div class="news-grid" data-stagger>
      ${news.map((p) => `<article class="news">
        <div class="news__media">${img(url(p.images?.[0] || p.poster), captionTitle(p.caption))}${p.images?.length > 1 ? `<span class="news__count">${p.images.length} fotos</span>` : ''}${p.video ? '<span class="news__count">Video</span>' : ''}</div>
        <div class="news__body">
          <time>${fmtDate(p.date)}</time>
          <h3>${esc(captionTitle(p.caption, 80))}</h3>
          <p>${esc(captionBody(p.caption.split('\n').slice(1).join(' '), 180))}</p>
          <a href="https://www.instagram.com/p/${p.code}/" target="_blank" rel="noopener">Ver en Instagram ↗</a>
        </div>
      </article>`).join('')}
    </div>
  </section>` : ''}

  ${gallery.length ? `<section class="place-gallery">
    <div class="section-head section-head--tight"><div><p class="kicker">( ${isStore ? 'Colección' : 'Del menú'} )</p><h2 class="h2--sm">${isStore ? 'Productos <span class="serif">destacados</span>' : 'Platos y <span class="serif">momentos</span>'}</h2></div><span class="muted">Tocá una foto para ampliarla</span></div>
    <div class="masonry" data-gallery>
      ${gallery.map((g, i) => `<button class="masonry__item" data-i="${i}" aria-label="Ampliar foto ${i + 1}">${img(g.src, captionTitle(g.caption))}<span class="masonry__cap">${esc(captionTitle(g.caption, 48))}</span></button>`).join('')}
    </div>
    <p class="credit">Fotos: ${[...new Set(gallery.map((g) => '@' + g.source))].map(esc).join(' · ')}</p>
  </section>` : ''}

  ${videos.length ? `<section class="place-videos">
    <div class="section-head section-head--tight"><div><p class="kicker">( En video )</p><h2 class="h2--sm">Mirá <span class="serif">${esc(x.name)}</span></h2></div></div>
    <div class="rail" data-rail>
      ${videos.map((v) => videoCard(v, { cls: 'vcard--reel', autoplay: 'visible', label: `<span>${esc(captionTitle(v.caption, 60))}</span>` })).join('')}
    </div>
  </section>` : ''}

  ${relatedFill.length ? `<section class="place-related">
    <div class="section-head section-head--tight"><div><p class="kicker">( ${isStore ? 'También te puede gustar' : 'Más en el Boulevard'} )</p></div><a class="link-arrow" href="${base}">Ver ${isStore ? 'todas las tiendas' : 'todo el Boulevard'} ${icons.arrow}</a></div>
    <div class="${isStore ? 'store-grid' : 'blv-grid blv-grid--compact'}" data-stagger>${relatedFill.map((r) => (isStore ? storeCard(r) : restaurantCard(r))).join('')}</div>
  </section>` : ''}

  <a class="next-place" href="${base}/${next.slug}" data-cursor="Siguiente">
    <span class="kicker">( Siguiente )</span>
    <span class="next-place__name">${esc(next.name)} ${icons.arrow}</span>
    ${coverOf(next) ? `<span class="next-place__img" aria-hidden="true">${img(coverOf(next))}</span>` : ''}
  </a>`;

  return {
    page: isStore ? 'store' : 'restaurant',
    title: `${x.name} — ${isStore ? 'Tienda' : 'Boulevard'} en Ventura Mall`,
    description: `${x.name} en Ventura Mall, Santa Cruz de la Sierra. ${x.about}`,
    html,
    mount({ main }) {
      const off = [bindVideos(main), initRails(main)];
      bindTilt(main);
      pageHeroIntro(main);
      $('[data-gallery]', main)?.addEventListener('click', (e) => {
        const b = e.target.closest('[data-i]');
        if (b) openLightbox(gallery.map((g) => ({ src: g.src, title: captionTitle(g.caption, 120) })), +b.dataset.i);
      });
      if (!reduced) {
        gsap.from('.place-id__logo', { scale: 0.6, rotation: -8, opacity: 0, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 });
        reveal($$('.info-card', main), { stagger: 0.07 });
        reveal($$('.place-about__text, .place-about__tags', main), { stagger: 0.1 });
        reveal($$('.masonry__item', main), { stagger: 0.06, group: 3 });
        reveal($$('.section-head h2', main), { stagger: 0 });
        reveal($$('.next-place__name', main));
        $$('[data-rail]', main).forEach((r) => reveal([...r.children].slice(0, 6), { stagger: 0.06, group: 6, kind: 'side' }));
        revealGrids(main);
      }
      return () => off.forEach((f) => f?.());
    },
  };
}
