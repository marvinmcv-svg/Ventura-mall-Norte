// ─────────────────────────────────────────────────────────────
// Ventura Mall — content data
// Single source of truth for brands, categories and mall info.
//
// NOTE: the brand list was compiled from public press coverage of
// Ventura Mall (opening coverage + later news). The official site was
// unreachable (expired SSL) and Instagram requires login, so please
// review this list with the leasing team and add / remove tenants.
// `logo` is optional: drop an SVG/PNG in /public/brands/ and set the
// path to replace the typographic wordmark.
// ─────────────────────────────────────────────────────────────

export const mall = {
  name: 'Ventura Mall',
  tagline: 'Donde Santa Cruz se encuentra',
  address: '4to Anillo esq. Av. San Martín, Equipetrol Norte',
  city: 'Santa Cruz de la Sierra, Bolivia',
  hours: [
    { label: 'Tiendas', value: '10:00 — 22:00' },
    { label: 'Patio de comidas', value: '10:00 — 23:00' },
    { label: 'Cinemark', value: 'Según cartelera' },
  ],
  parking: '2.000+',
  instagram: 'https://www.instagram.com/venturamalloficial/',
  instagramHandle: '@venturamalloficial',
  facebook: 'https://www.facebook.com/venturamalloficial',
  mapsQuery: 'Ventura Mall, Santa Cruz de la Sierra, Bolivia',
};

export const categories = [
  {
    id: 'moda',
    name: 'Moda',
    kicker: '01',
    blurb: 'Las firmas internacionales que definen la temporada, en un solo recorrido.',
    image: 'media/rack-warm.jpg',
  },
  {
    id: 'deporte',
    name: 'Deporte',
    kicker: '02',
    blurb: 'Performance y streetwear de las marcas que mueven al mundo.',
    image: 'media/sneaker.jpg',
  },
  {
    id: 'belleza',
    name: 'Belleza & Accesorios',
    kicker: '03',
    blurb: 'Joyería, fragancias y cosmética para cada ritual.',
    image: 'media/beauty.jpg',
  },
  {
    id: 'gastronomia',
    name: 'Gastronomía',
    kicker: '04',
    blurb: 'Del café de la mañana a la cena de autor. Bulevar, terrazas y patio de comidas.',
    image: 'media/food-hall.jpg',
  },
  {
    id: 'entretenimiento',
    name: 'Entretenimiento',
    kicker: '05',
    blurb: 'Cine, bowling y noches que se alargan.',
    image: 'media/cinema.jpg',
  },
  {
    id: 'hogar',
    name: 'Hogar & Lifestyle',
    kicker: '06',
    blurb: 'Diseño, viaje y todo lo que hace tuyo un espacio.',
    image: 'media/storefront.jpg',
  },
];

export const brands = [
  // Moda
  { name: 'Mango', cat: 'moda' },
  { name: 'Zara', cat: 'moda' },
  { name: 'Forever 21', cat: 'moda' },
  { name: 'Tommy Hilfiger', cat: 'moda' },
  { name: 'Nautica', cat: 'moda' },
  { name: "Levi's", cat: 'moda' },
  { name: 'Hush Puppies', cat: 'moda' },
  { name: 'Clarks', cat: 'moda' },
  { name: 'Caterpillar', cat: 'moda' },
  { name: 'La Riviera', cat: 'moda' },
  // Deporte
  { name: 'Nike', cat: 'deporte' },
  { name: 'Adidas', cat: 'deporte' },
  { name: 'Puma', cat: 'deporte' },
  { name: 'Under Armour', cat: 'deporte' },
  { name: 'Converse', cat: 'deporte' },
  // Belleza & accesorios
  { name: 'Swarovski', cat: 'belleza' },
  { name: 'Tous', cat: 'belleza' },
  { name: 'MAC Cosmetics', cat: 'belleza' },
  { name: "L'Occitane", cat: 'belleza' },
  // Hogar & lifestyle
  { name: 'Casaideas', cat: 'hogar' },
  { name: 'Totto', cat: 'hogar' },
  // Gastronomía
  { name: 'Hard Rock Cafe', cat: 'gastronomia' },
  { name: "P.F. Chang's", cat: 'gastronomia' },
  { name: "TGI Fridays", cat: 'gastronomia' },
  { name: 'Starbucks', cat: 'gastronomia' },
  { name: 'Juan Valdez', cat: 'gastronomia' },
  { name: 'Cinnabon', cat: 'gastronomia' },
  { name: 'KFC', cat: 'gastronomia' },
  { name: 'Burger King', cat: 'gastronomia' },
  { name: 'Pizza Hut', cat: 'gastronomia' },
  { name: 'Pollos Copacabana', cat: 'gastronomia' },
  // Entretenimiento
  { name: 'Cinemark', cat: 'entretenimiento' },
  { name: 'Bowling', cat: 'entretenimiento' },
];

export const experiences = [
  {
    title: 'Cinemark',
    text: 'Salas de última generación y los estrenos del mundo, en el corazón de Equipetrol.',
    image: 'media/cinema.jpg',
  },
  {
    title: 'Bulevar gastronómico',
    text: 'Terrazas, bares y cafés que convierten una tarde de compras en una noche entera.',
    image: 'media/bar.jpg',
  },
  {
    title: 'Bowling & juegos',
    text: 'Pistas, risas y competencia sana para toda la familia.',
    image: 'media/arcade.jpg',
  },
];
