// Tiny History-API router with an animated curtain between pages.
// A view is { title, html, mount?(ctx) => cleanup? }. Every ScrollTrigger and
// tween a view creates inside mount() lives in a gsap.context that is reverted
// when leaving the page, so pages never leak animations into each other.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, reduced, closeLightbox } from './ui.js';

const routes = [];
let current = null; // { cleanup, ctx, path }
let busy = false;
let opts = {};

export function route(pattern, load) { routes.push({ pattern, load }); }
export function initRouter(o) {
  opts = o;
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    e.preventDefault();
    opts.onLinkClick?.();
    if (href.startsWith('#')) return scrollToHash(href);
    navigate(href);
  });
  window.addEventListener('popstate', () => render(location.pathname + location.hash, { pop: true }));
  return render(location.pathname + location.hash, { first: true });
}

export function navigate(href) {
  const u = new URL(href, location.href);
  const target = u.pathname + u.search + u.hash;
  if (u.pathname === location.pathname && u.search === location.search) {
    if (u.hash) { history.replaceState(null, '', target); return scrollToHash(u.hash); }
    return opts.scrollTo?.(0);
  }
  history.pushState(null, '', target);
  render(target, {});
}

export function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (el) opts.scrollTo?.(el);
}

async function resolve(path) {
  const clean = path.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
  for (const r of routes) {
    const m = clean.match(r.pattern);
    if (m) return { view: await r.load(...m.slice(1).map(decodeURIComponent)), clean };
  }
  return { view: null, clean };
}

async function render(path, { first, pop }) {
  if (busy) return;
  busy = true;
  closeLightbox();
  const curtain = $('.curtain');
  const { view: v, clean } = await resolve(path);
  const view = v || (await opts.notFound());

  if (!first) {
    opts.lenis?.stop();
    if (!reduced) {
      gsap.set(curtain, { display: 'block' });
      await gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
    }
  }

  // tear down the previous page
  if (current) {
    try { current.cleanup?.(); } catch (err) { console.warn(err); }
    current.ctx.revert();
  }
  const main = $('#app');
  main.innerHTML = view.html;
  document.title = view.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && view.description) desc.content = view.description;
  document.body.dataset.page = view.page || 'page';
  window.scrollTo(0, 0);
  opts.lenis?.scrollTo(0, { immediate: true, force: true });

  const ctx = gsap.context(() => {}, main);
  let cleanup;
  ctx.add(() => { cleanup = view.mount?.({ main, ctx, first, scrollTo: opts.scrollTo }); });
  current = { cleanup, ctx, path: clean };
  opts.onRender?.(view, { first });
  ScrollTrigger.refresh();

  if (!first) {
    if (!reduced) await gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'expo.inOut', delay: 0.05 });
    gsap.set(curtain, { display: 'none' });
    opts.lenis?.start();
  }
  // deep link to a section of the new page
  const hash = path.includes('#') ? path.slice(path.indexOf('#')) : '';
  if (hash && hash.length > 1) setTimeout(() => scrollToHash(hash), first ? 900 : 60);
  if (!pop) $('#app').focus({ preventScroll: true });
  busy = false;
}
