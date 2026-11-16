import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stores, restaurants, categories, mallPhoto } from '../content.js';
import { $, $$, esc, icons, reduced, bindTilt, bgSrc } from '../ui.js';
import { storeCard } from './cards.js';
import { splitChars } from '../split.js';

export function directoryView() {
  const params = new URLSearchParams(location.search);
  let active = categories.some((c) => c.id === params.get('cat')) ? params.get('cat') : 'all';
  let q = params.get('q') || '';
  const cats = [{ id: 'all', name: 'Todas' }, ...categories.filter((c) => stores.some((s) => s.cat === c.id))];
  const bg = mallPhoto('mall-interior');

  const html = `
  <header class="page-hero page-hero--dir">
    ${bg ? `<div class="page-hero__bg" style="background-image:url('${bgSrc(bg)}')" aria-hidden="true"></div>` : ''}
    <div class="page-hero__inner">
      <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><span aria-current="page">Tiendas</span></nav>
      <h1 class="page-title"><span class="line"><span class="split">Nuestras</span></span><span class="line"><span class="split serif">tiendas</span></span></h1>
      <p class="page-lead">${stores.length} marcas en moda, belleza, niños, gastronomía y servicios — y ${restaurants.length} restaurantes en el Boulevard. Tocá una tienda para ver su ubicación, novedades y productos.</p>
    </div>
  </header>

  <section class="directory">
    <div class="directory__tools">
      <div class="chips" role="tablist" aria-label="Filtrar por categoría">
        ${cats.map((c) => {
          const n = c.id === 'all' ? stores.length : stores.filter((s) => s.cat === c.id).length;
          return `<button class="chip" role="tab" aria-selected="${c.id === active}" data-chip="${c.id}">${esc(c.name)}<sup>${n}</sup></button>`;
        }).join('')}
      </div>
      <label class="search">
        <span class="sr-only">Buscar tienda</span>
        <input type="search" placeholder="Buscar tienda o producto…" value="${esc(q)}" data-search autocomplete="off" />
      </label>
    </div>
    <div class="store-grid store-grid--full" data-grid></div>
    <p class="directory__empty" data-empty hidden>No encontramos esa tienda. <button class="link-btn" data-open-funnel>Escribinos y te ayudamos</button>.</p>

    <a class="promo-band" href="/boulevard" data-cursor="Ver">
      <span class="kicker">( Boulevard de Luz )</span>
      <b>¿Con hambre? <span class="serif">${restaurants.length} restaurantes</span> te esperan</b>
      <span class="promo-band__go">${icons.arrow}</span>
    </a>
  </section>`;

  return {
    page: 'directory',
    title: 'Tiendas — Ventura Mall',
    description: `Directorio de tiendas de Ventura Mall: ${stores.map((s) => s.name).join(', ')}.`,
    html,
    mount({ main }) {
      const grid = $('[data-grid]', main);
      const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      const draw = (animate) => {
        const t = norm(q.trim());
        const list = stores
          .filter((s) => active === 'all' || s.cat === active)
          .filter((s) => !t || norm([s.name, s.about, ...(s.lines || [])].join(' ')).includes(t));
        grid.innerHTML = list.map(storeCard).join('');
        $('[data-empty]', main).hidden = list.length > 0;
        bindTilt(grid);
        if (animate && !reduced) gsap.fromTo(grid.children, { y: 50, opacity: 0, rotationX: -14, transformPerspective: 1000 }, { y: 0, opacity: 1, rotationX: 0, duration: 0.9, ease: 'expo.out', stagger: 0.035, overwrite: true });
        ScrollTrigger.refresh();
      };
      const sync = () => {
        const p = new URLSearchParams();
        if (active !== 'all') p.set('cat', active);
        if (q) p.set('q', q);
        history.replaceState(null, '', `/tiendas${p.toString() ? `?${p}` : ''}`);
      };
      $('.chips', main).addEventListener('click', (e) => {
        const chip = e.target.closest('[data-chip]');
        if (!chip) return;
        active = chip.dataset.chip;
        $$('[data-chip]', main).forEach((c) => c.setAttribute('aria-selected', String(c === chip)));
        sync(); draw(true);
      });
      $('[data-search]', main).addEventListener('input', (e) => { q = e.target.value; sync(); draw(true); });
      draw(false);
      pageHeroIntro(main);
      if (!reduced) gsap.fromTo(grid.children, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.04, delay: 0.5 });
    },
  };
}

/** Shared intro for page heroes: title chars rise, background drifts. */
export function pageHeroIntro(main) {
  const chars = $$('.page-title .split', main).flatMap(splitChars);
  if (reduced) return;
  gsap.from(chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.025, delay: 0.15 });
  gsap.from($$('.page-lead, .crumbs, .page-hero__meta, .page-hero__actions', main), { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.4 });
  const bg = $('.page-hero__bg', main);
  if (bg) {
    gsap.fromTo(bg, { scale: 1.2 }, { scale: 1.04, duration: 2.2, ease: 'expo.out' });
    gsap.to(bg, { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
}
