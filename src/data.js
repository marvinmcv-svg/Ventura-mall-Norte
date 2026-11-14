// ─────────────────────────────────────────────────────────────
// Ventura Mall (Norte) — content data. Every fact is sourced:
//   [web]  venturamall.bo, archived 14 Mar 2026 (web.archive.org)
//   [ig]   @venturamalloficial Instagram posts, 1–13 Nov 2026
//   [tt]   @venturamalloficial TikTok
//   [blv]  atom.bio/boulevardventuramall (link in the IG bio)
//   [wiki] es.wikipedia.org/wiki/Ventura_Mall
//   [ta]   TripAdvisor listing
// `media` keys resolve to real downloaded files (see src/media.js).
// ─────────────────────────────────────────────────────────────

export const mall = {
  name: 'Ventura Mall',
  tagline: 'Somos el mall que Bolivia prefiere', // [ig] bio
  hashtag: '#VivíloEnGrande', // [ig] bio
  address: 'Av. San Martín esq. 4to Anillo, Equipetrol Norte', // [web] + [wiki]
  city: 'Santa Cruz de la Sierra, Bolivia',
  phone: '+591 3 3432121', // [web]
  phoneHref: 'tel:+59133432121',
  email: 'info@venturamall.bo', // [web]
  coords: { lat: -17.75465, lng: -63.1998 }, // [web]
  hours: [ // [web]
    { label: 'Tiendas', value: 'Lun–Sáb 10:00–22:00 · Dom 11:00–22:00', open: [11, 22], openWeekday: [10, 22] },
    { label: 'Patio de comidas', value: 'Lun–Dom 11:00–23:00' },
    { label: 'Boulevard', value: 'Lun–Dom 11:00–23:00 · según local desde 7:00 o hasta 3:00' },
    { label: 'Bancos y servicios', value: 'Lun–Sáb 11:00–22:00 · Dom 11:00–21:00' },
  ],
  facts: [ // [wiki]
    { value: 110000, suffix: ' m²', label: 'construidos' },
    { value: 13, label: 'salas de cine, una IMAX de 16 × 21 m' },
    { value: 4, label: 'plantas y un subsuelo' },
    { value: 2014, label: 'inaugurado el 30 de enero', plain: true },
  ],
  socials: {
    instagram: { url: 'https://www.instagram.com/venturamalloficial/', handle: '@venturamalloficial', followers: '55.9K' }, // [ig]
    tiktok: { url: 'https://www.tiktok.com/@venturamalloficial', handle: '@venturamalloficial', followers: '449.5K' }, // [tt]
    facebook: { url: 'https://www.facebook.com/VenturaMallBolivia', handle: 'VenturaMallBolivia' }, // [web]
  },
  whatsapp: { number: '59171348871', label: 'Boulevard Ventura Mall' }, // [blv]
  mapsQuery: 'Ventura Mall, Av. San Martín, Santa Cruz de la Sierra, Bolivia',
};

export const categories = [
  { id: 'moda', name: 'Moda', kicker: '01', media: 'ig-DfpaR0zjnfK-1', blurb: 'BOSS, HUGO, Armani Exchange, Calvin Klein, Mango, Levi’s y más.' },
  { id: 'belleza', name: 'Belleza & Accesorios', kicker: '02', media: 'ig-DfkGPwYEw7A-1', blurb: 'O Boticário, Carrasco, Chilli Beans, Ópticas Pauker y women’secret.' },
  { id: 'ninos', name: 'Niños & Regalos', kicker: '03', media: 'ig-DfkoksPDYnm-1', blurb: 'Kids Collection, Baby Corp, Mariposa Gift Shop y Ventura Kids.' },
  { id: 'gastronomia', name: 'Gastronomía', kicker: '04', media: 'ig-Dfp4sDXDj42-1', blurb: 'El Boulevard, Fogo de Chão, Hard Rock Cafe, Churromanía y Cinnabon.' },
  { id: 'servicios', name: 'Salud & Servicios', kicker: '05', media: 'mall-interior', blurb: 'Spacio Médico, bancos, telefónicas y agencias de viaje.' },
];

// Stores: only tenants that appear in official posts. `media` = a real post
// image of that store; `logo` = brand logo key (downloaded at build time).
export const brands = [
  { name: 'BOSS', slug: 'boss', cat: 'moda', where: 'Nivel 1 · Local 57', media: 'ig-DfpaR0zjnfK-1', logo: 'logo-boss', tiktok: '7691530889594981639' },
  { name: 'HUGO', slug: 'hugo', cat: 'moda', where: 'Piso 1', media: 'ig-Dfner4ADhBK', logo: 'logo-boss' },
  { name: 'Armani Exchange', slug: 'armani-exchange', cat: 'moda', where: 'Nivel 1', media: 'ig-DfqILz-jnrP-1', logo: 'logo-armani-exchange' },
  { name: 'Calvin Klein', slug: 'calvin-klein', cat: 'moda', media: 'ig-DfkQ9j_liQ4-1', logo: 'logo-calvin-klein' },
  { name: 'Mango', slug: 'mango', cat: 'moda', media: 'ig-DfkQWi9oJBp-1', logo: 'logo-mango' },
  { name: 'Springfield', slug: 'springfield', cat: 'moda', media: 'ig-DfkoltNisy6-1', logo: 'logo-springfield' },
  { name: 'Forever 21', slug: 'forever-21', cat: 'moda', media: 'ig-DfX02iaDuZz', logo: 'logo-forever-21' },
  { name: 'Levi’s', slug: 'levis', cat: 'moda', logo: 'logo-levis', tiktok: '7699220624291466514', media: 'tt-7699220624291466514' },
  { name: 'Aeropostale', slug: 'aeropostale', cat: 'moda', logo: 'logo-aeropostale', tiktok: '7697108071105023238', media: 'tt-7697108071105023238' },
  { name: 'Delux', slug: 'delux', cat: 'moda', media: 'ig-DfqDN9sqDqQ' },
  { name: 'Manhattan', slug: 'manhattan', cat: 'moda', media: 'ig-Dfr0DW_gECQ' },
  { name: 'Textilón', slug: 'textilon', cat: 'moda', media: 'ig-DfkFqjxlBHp', whatsapp: '59175011152' },
  { name: 'women’secret', slug: 'womensecret', cat: 'belleza', media: 'ig-DfkGPwYEw7A-1', logo: 'logo-womensecret' },
  { name: 'O Boticário', slug: 'o-boticario', cat: 'belleza', where: '1er piso · #49', logo: 'logo-o-boticario' },
  { name: 'Chilli Beans', slug: 'chilli-beans', cat: 'belleza', media: 'ig-DfkZKQCINN2', logo: 'logo-chilli-beans' },
  { name: 'Carrasco', slug: 'carrasco', cat: 'belleza', tiktok: '7705912235612278034', media: 'tt-7705912235612278034' },
  { name: 'Ópticas Pauker', slug: 'opticas-pauker', cat: 'belleza', tiktok: '7702190696136150290', media: 'tt-7702190696136150290' },
  { name: 'Kids Collection', slug: 'kids-collection', cat: 'ninos', media: 'ig-DfnqsxIkUf9' },
  { name: 'Baby Corp', slug: 'baby-corp', cat: 'ninos', media: 'ig-DfpZ0s2FC42' },
  { name: 'Mariposa Gift Shop', slug: 'mariposa', cat: 'ninos', where: 'Piso 1 · Local 4', media: 'ig-DfkoksPDYnm-1', whatsapp: '59171375733' },
  { name: 'Churromanía', slug: 'churromania', cat: 'gastronomia', where: 'Primer piso', media: 'ig-DfkHRWTxzX0' },
  { name: 'Spacio Médico', slug: 'spacio-medico', cat: 'servicios', where: 'Nivel 2', media: 'ig-Dfm4RqMlG_l' },
];

// Boulevard restaurants with their own WhatsApp — [blv]; Cinnabon — [ta]
export const boulevard = [
  { name: 'Fogo de Chão', cuisine: 'Churrasquería brasileña', wa: 'https://wa.link/5n27qf', media: 'ig-Dfp4sDXDj42-1', logo: 'logo-fogo-de-chao' },
  { name: 'Hard Rock Cafe', cuisine: 'Americana · Música en vivo', wa: 'https://wa.me/59177209923', logo: 'logo-hard-rock-cafe' },
  { name: 'Bahiana', cuisine: 'Restaurante', wa: 'https://wa.me/59178242852' },
  { name: 'Bestial', cuisine: 'Restaurante', wa: 'https://wa.me/59176623913' },
  { name: 'El Cuartito', cuisine: 'Bar', wa: 'https://wa.me/59176623913' },
  { name: 'Kaos', cuisine: 'Bar', wa: 'https://wa.link/m1yu9w' },
  { name: 'Fiesta Perú', cuisine: 'Cocina peruana', wa: 'https://wa.link/2kf8v1' },
  { name: 'República', cuisine: 'Restaurante & bar', wa: 'https://wa.link/rql8w2' },
  { name: 'Route66', cuisine: 'Americana', wa: 'https://wa.link/x3v91s' },
  { name: 'Regiones', cuisine: 'Cocina boliviana', wa: 'https://wa.link/42gi23' },
  { name: 'Vaca Morena', cuisine: 'Parrilla', wa: 'https://wa.link/v0du5q' },
  { name: 'Cinnabon', cuisine: 'Postres & café', logo: 'logo-cinnabon' },
];

// Ruta Boulevard: live music. [ig]
export const events = [
  { title: 'Grupo KLASS', when: 'Viernes · 21:00', where: 'Área Verde', text: 'Clásicos del pop en inglés y español.', media: 'ig-DfpeFtYjicV' },
  { title: 'Hnos. Barbery', when: 'Sábado · 21:00', where: 'Costanera', text: 'Música en vivo en el Boulevard de Luz.', media: 'ig-DfcYRBhDrAd' },
  { title: 'Ángel Royo', when: 'Viernes', where: 'Área Verde', text: 'Una noche iluminada por la música.', media: 'ig-DfaB85ijlIm' },
  { title: 'Ventura Kids', when: 'Domingo', where: 'Atrio Principal', text: 'Los pequeños se convierten en creadores.', media: 'ig-Dfcy4LTCXt9' },
];

export const experiences = [
  { title: 'Ruta Boulevard', text: 'Música en vivo en el Área Verde y la Costanera, con la gastronomía y el encanto del Boulevard de Luz.', media: 'ig-DfbUIfdDVTz-1' },
  { title: '13 salas de cine', text: 'Incluida una sala IMAX de 16 metros de alto y 21 de ancho, y cuatro salas VIP.', media: 'mall-interior' },
  { title: 'Ventura Sur', text: 'Nuestro nuevo mall ya está abierto. Gran inauguración oficial el 28 de noviembre.', media: 'ig-Dfkc3EdieT_-1' },
];

// Instagram ring + gallery: real posts, newest first
export const feed = [
  'ig-DfbUIfdDVTz-1', 'ig-DfbUIfdDVTz-2', 'ig-DfOOSKXku3N', 'ig-Dfp4sDXDj42-2', 'ig-DfkQ9j_liQ4-2', 'ig-DfpaR0zjnfK-2',
  'ig-DfbUIfdDVTz-3', 'ig-Dfkc3EdieT_-2', 'ig-DfkGPwYEw7A-2', 'ig-DfqILz-jnrP-2', 'ig-DfkQWi9oJBp-2', 'ig-DfbUIfdDVTz-4',
  'ig-Dfkc3EdieT_-3', 'ig-DfkoltNisy6-2', 'ig-Dfcy4LTCXt9', 'ig-DfbUIfdDVTz-5',
];

export const reels = ['DflHJ_3x2zk', 'DfqDN9sqDqQ', 'Dfr9hhtKC-8', 'DfYQLqooA_4', 'DfsjwfrhLKd', 'DfnoFaRFIRk'];
export const tiktoks = ['7691530889594981639', '7697108071105023238', '7699220624291466514'];

// WhatsApp funnel — each intent goes to a real WhatsApp line.
export const funnel = [
  { id: 'reserva', label: 'Reservar en el Boulevard', icon: '🍽️', ask: '¿En qué restaurante?', options: boulevard.filter((b) => b.wa).map((b) => ({ label: b.name, href: b.wa, msg: `Hola ${b.name}, quiero hacer una reserva (vengo desde venturamall.bo).` })) },
  { id: 'evento', label: 'Eventos y Ruta Boulevard', icon: '🎶', href: `https://wa.me/${mall.whatsapp.number}`, msg: 'Hola, quiero información sobre los eventos de Ruta Boulevard en Ventura Mall.' },
  { id: 'tiendas', label: 'Consultar a una tienda', icon: '🛍️', ask: '¿Qué tienda?', options: [
    { label: 'Mariposa Gift Shop', href: 'https://wa.me/59171375733', msg: 'Hola Mariposa Gift Shop, tengo una consulta (vengo desde venturamall.bo).' },
    { label: 'Textilón', href: 'https://wa.me/59175011152', msg: 'Hola Textilón, tengo una consulta (vengo desde venturamall.bo).' },
  ] },
  { id: 'general', label: 'Información general', icon: 'ℹ️', href: mall.phoneHref, note: `Llamá al ${mall.phone} o escribí a ${mall.email}` },
];
