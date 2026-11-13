// ─────────────────────────────────────────────────────────────
// Ventura Mall (Norte) — content data
// Every fact below is sourced. Sources:
//   [web]  venturamall.bo (archived 14 Mar 2026, web.archive.org)
//   [ig]   @venturamalloficial posts, 8–13 Nov 2026
// Tenants are listed only if they appear in an official post.
// ─────────────────────────────────────────────────────────────

export const mall = {
  name: 'Ventura Mall',
  tagline: 'Somos el mall que Bolivia prefiere', // [ig] bio
  hashtag: '#VivíloEnGrande', // [ig] bio
  address: 'Av. San Martín esq. 4to Anillo', // [web]
  city: 'Santa Cruz de la Sierra, Bolivia',
  phone: '+591 3 3432121', // [web]
  email: 'info@venturamall.bo', // [web]
  coords: { lat: -17.75465, lng: -63.19980 }, // [web] map destination
  hours: [ // [web]
    { label: 'Locales comerciales', value: 'Lun–Sáb 10:00–22:00 · Dom 11:00–22:00' },
    { label: 'Patio de comidas', value: 'Lun–Dom 11:00–23:00' },
    { label: 'Boulevard', value: 'Lun–Dom 11:00–23:00 · según rubro desde 7:00 o hasta 3:00' },
    { label: 'Bancos y servicios', value: 'Lun–Sáb 11:00–22:00 · Dom 11:00–21:00' },
  ],
  instagram: 'https://www.instagram.com/venturamalloficial/',
  instagramHandle: '@venturamalloficial',
  instagramFollowers: '55.9K', // [ig] 13 Nov 2026
  facebook: 'https://www.facebook.com/VenturaMallBolivia', // [web]
  boulevardLinks: 'https://www.atom.bio/boulevardventuramall', // [ig] bio link
  mapsQuery: 'Ventura Mall, Av. San Martín, Santa Cruz de la Sierra, Bolivia',
};

export const categories = [
  { id: 'moda', name: 'Moda', kicker: '01', blurb: 'BOSS, HUGO, Armani Exchange, Calvin Klein, Mango y más.', image: 'media/rack-warm.jpg' },
  { id: 'ninos', name: 'Niños & Regalos', kicker: '02', blurb: 'Kids Collection, Baby Corp y Mariposa Gift Shop.', image: 'media/storefront.jpg' },
  { id: 'gastronomia', name: 'Gastronomía', kicker: '03', blurb: 'Patio de comidas y Boulevard de Luz.', image: 'media/food-hall.jpg' },
  { id: 'servicios', name: 'Salud & Servicios', kicker: '04', blurb: 'Bancos, telefónicas, agencias de viaje y Spacio Médico.', image: 'media/mall-atrium.jpg' },
];

export const brands = [
  // Moda  — all [ig], Nov 2026
  { name: 'BOSS', cat: 'moda', where: 'Nivel 1, Local 57' },
  { name: 'HUGO', cat: 'moda', where: 'Piso 1' },
  { name: 'Armani Exchange', cat: 'moda' },
  { name: 'Calvin Klein', cat: 'moda' },
  { name: 'Mango', cat: 'moda' },
  { name: 'Mango Man', cat: 'moda' },
  { name: 'Springfield', cat: 'moda' },
  { name: 'Forever 21', cat: 'moda' },
  { name: 'Delux', cat: 'moda' },
  { name: 'Manhattan', cat: 'moda' },
  { name: 'Textilón', cat: 'moda' },
  { name: "women'secret", cat: 'moda' },
  // Niños
  { name: 'Kids Collection', cat: 'ninos' },
  { name: 'Baby Corp', cat: 'ninos' },
  { name: 'Mariposa Gift Shop', cat: 'ninos' },
  // Gastronomía
  { name: 'Fogo de Chão', cat: 'gastronomia' },
  // Servicios
  { name: 'Spacio Médico', cat: 'servicios' },
];

// TODO(media): set image paths once `npm run fetch-media` has run.
export const experiences = [
  {
    title: 'Ruta Boulevard',
    text: 'Música en vivo en el Área Verde, con la gastronomía y el encanto del Boulevard de Luz.', // [ig]
    image: 'media/bar.jpg',
  },
  {
    title: 'Fogo de Chão',
    text: 'Auténtico churrasco brasileño, fuego y sabor. Rodizio Ejecutivo al mediodía.', // [ig]
    image: 'media/restaurant.jpg',
  },
  {
    title: 'Ventura Sur',
    text: 'Nuestro nuevo mall ya está abierto. Gran inauguración oficial el 28 de noviembre.', // [ig] 10 Nov 2026
    image: 'media/mall-atrium.jpg',
  },
];
