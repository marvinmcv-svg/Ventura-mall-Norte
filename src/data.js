// ─────────────────────────────────────────────────────────────
// Ventura Mall (Norte) — all site content. Every fact is sourced:
//   [web]  venturamall.bo (archived 14 Mar 2026)
//   [ig]   @venturamalloficial posts, Nov 2026
//   [own]  the store's / restaurant's own official Instagram account
//   [blv]  atom.bio/boulevardventuramall (link in the Boulevard bio)
//   [wiki] Wikipedia
//   [fogo] fogodechao.com/location/santa-cruz
// Photos/videos come from those accounts and live in public/media
// (see src/media.json). This file is plain data so the serverless
// assistant (api/chat.js) can import it too.
// ─────────────────────────────────────────────────────────────

export const mall = {
  name: 'Ventura Mall',
  tagline: 'Somos el mall que Bolivia prefiere', // [ig]
  hashtag: '#VivíloEnGrande', // [ig]
  address: 'Av. San Martín esq. 4to Anillo, Equipetrol Norte', // [web]
  city: 'Santa Cruz de la Sierra, Bolivia',
  phone: '+591 3 3432121', // [web]
  phoneHref: 'tel:+59133432121',
  email: 'info@venturamall.bo', // [web]
  coords: { lat: -17.75465, lng: -63.1998 }, // [web]
  hours: [ // [web]
    { label: 'Tiendas', value: 'Lun–Sáb 10:00–22:00 · Dom 11:00–22:00' },
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
    instagram: { url: 'https://www.instagram.com/venturamalloficial/', handle: '@venturamalloficial', followers: '56K' },
    tiktok: { url: 'https://www.tiktok.com/@venturamalloficial', handle: '@venturamalloficial', followers: '449.5K' },
    facebook: { url: 'https://www.facebook.com/VenturaMallBolivia', handle: 'VenturaMallBolivia' },
  },
  whatsapp: { number: '59171348871', label: 'Boulevard Ventura Mall' }, // [blv]
  mapsQuery: 'Ventura Mall, Av. San Martín, Santa Cruz de la Sierra, Bolivia',
};

export const categories = [
  { id: 'moda', name: 'Moda', kicker: '01', blurb: 'BOSS, HUGO, Armani Exchange, Calvin Klein, Mango, Levi’s y más.', cover: 'DfpaR0zjnfK' },
  { id: 'belleza', name: 'Belleza, Joyas & Óptica', kicker: '02', blurb: 'O Boticário, Joyería Carrasco, Chilli Beans, Ópticas Pauker y women’secret.', cover: 'DfkGPwYEw7A' },
  { id: 'ninos', name: 'Niños & Regalos', kicker: '03', blurb: 'Kids Collection, Baby Corp y Mariposa Gift Shop.', cover: 'DfkoksPDYnm' },
  { id: 'gastronomia', name: 'Gastronomía', kicker: '04', blurb: 'El Boulevard: Fogo de Chão, Hard Rock Cafe, Fiesta Perú, Regiones y más.', cover: 'Dfp4sDXDj42', href: '/boulevard' },
  { id: 'servicios', name: 'Salud & Servicios', kicker: '05', blurb: 'Spacio Médico, bancos, telefónicas y agencias de viaje.', cover: 'Dfm4RqMlG_l' },
];

// ── Stores ───────────────────────────────────────────────────
// ig: the brand's official account (logo + collection photos)
// posts: @venturamalloficial posts about this store at Ventura
// tiktok: @venturamalloficial TikTok featuring the store
export const stores = [
  { slug: 'boss', cover: 'DfpaR0zjnfK:1', name: 'BOSS', cat: 'moda', where: 'Nivel 1 · Local 57', ig: 'boss', igLocal: null,
    posts: ['DfpaR0zjnfK', 'DflFT4NpjlN', 'Dfhie0Am-qb', 'DfcvzC-mtWs'], tiktok: '7691530889594981639',
    catalog: 'https://wa.me/c/59172155060', // [ig]/[fb] "Explorá la colección"
    about: 'La línea principal de HUGO BOSS, la casa de moda alemana fundada en 1924 en Metzingen. Sastrería de corte impecable, camisas, polos, denim, calzado y accesorios para el día a día y para las ocasiones que importan.',
    lines: ['Trajes y sastrería', 'Camisas y polos', 'Denim y casual', 'Calzado', 'Accesorios y fragancias'] },
  { slug: 'hugo', cover: 'Dfe6hJwk7fv:1', name: 'HUGO', cat: 'moda', where: 'Piso 1', ig: 'hugo_official', noLogo: true,
    posts: ['Dfner4ADhBK', 'Dfkb-1VjQ37', 'DfczNg5n-hC'],
    about: 'La marca más joven y atrevida del grupo HUGO BOSS: siluetas modernas, sastrería relajada y básicos con actitud para quienes rompen las reglas.',
    lines: ['Ternos', 'Camisas', 'Polos y poleras', 'Pantalones', 'Denim'] },
  { slug: 'armani-exchange', cover: 'DfqILz-jnrP:1', name: 'Armani Exchange', cat: 'moda', where: 'Nivel 1 · Local 11', ig: 'armaniexchange',
    posts: ['DfqILz-jnrP', 'Dfk0MyABbHF', 'DfcwRLkjgNx'],
    about: 'La línea urbana de Giorgio Armani, creada en 1991: estilo metropolitano con logos icónicos, denim, básicos y accesorios para hombre y mujer.',
    lines: ['Hombre', 'Mujer', 'Denim', 'Relojes y accesorios'] },
  { slug: 'calvin-klein', cover: 'DfkQ9j_liQ4:1', name: 'Calvin Klein', cat: 'moda', ig: 'calvinklein',
    posts: ['DfkQ9j_liQ4', 'DfcWJbNDPkI'], tiktok: '7699208757946895622',
    about: 'Marca estadounidense fundada en Nueva York en 1968, famosa por su ropa interior y su denim. Esenciales minimalistas, jeans, ropa interior y accesorios.',
    lines: ['Ropa interior', 'Denim', 'Básicos', 'Accesorios'] },
  { slug: 'mango', cover: 'DfkQWi9oJBp:1', name: 'Mango', cat: 'moda', ig: 'mango',
    posts: ['DfsjwfrhLKd', 'Dfm3OJshPWf', 'DfkSEEdp0sI', 'DfkQWi9oJBp', 'DfcqBVtjmGi'], tiktok: '7700814391259761927',
    about: 'Firma de moda nacida en Barcelona en 1984. En Ventura encontrás Mango Woman, Mango Man y Kids, con tendencias de temporada y básicos versátiles.',
    lines: ['Mujer', 'Hombre (Mango Man)', 'Kids', 'Accesorios'] },
  { slug: 'springfield', cover: 'Dfr9hhtKC-8:0', name: 'Springfield', cat: 'moda',
    posts: ['DfkoltNisy6', 'Dfr9hhtKC-8', 'DfdWHEaEou1'],
    about: 'Marca española de moda casual para hombre y mujer. En Santa Cruz presenta su colección Primavera-Verano ’26 de espíritu mediterráneo y denim de corte straight fit.',
    lines: ['Hombre', 'Mujer', 'Denim', 'Primavera-Verano ’26'] },
  { slug: 'forever-21', cover: 'DfaCWE3l1bi:0', name: 'Forever 21', cat: 'moda', ig: 'forever21',
    posts: ['DfnoFaRFIRk'],
    about: 'Moda rápida nacida en Los Ángeles: tendencias del momento, básicos y accesorios a precios accesibles.',
    lines: ['Mujer', 'Hombre', 'Accesorios', 'Tendencias'] },
  { slug: 'levis', cover: 'DflDBOHGh9O:0', name: 'Levi’s', cat: 'moda', ig: 'levis', tiktok: '7699220624291466514',
    about: 'Los creadores del blue jean desde 1873. El icónico 501, jeans para cada calce, camperas de denim, poleras y accesorios.',
    lines: ['Jeans 501 y más calces', 'Camperas de denim', 'Poleras', 'Accesorios'] },
  { slug: 'aeropostale', cover: 'Dfpb_zhF7Q0:0', name: 'Aéropostale', cat: 'moda', ig: 'aeropostale', tiktok: '7697108071105023238',
    about: 'Marca estadounidense de moda casual juvenil. Su primera tienda en Santa Cruz está en Ventura: básicos de impacto, hoodies, jeans y gráficos.',
    lines: ['Básicos', 'Hoodies', 'Jeans', 'Gráficos'] },
  { slug: 'delux', cover: 'DfVodvmDme1:0', name: 'Delux', cat: 'moda', where: 'Piso 1', ig: 'deluxscz',
    posts: ['DfqDN9sqDqQ'], tiktok: '7698204739409956112',
    about: 'Tienda multimarca cruceña con tus marcas favoritas y looks para cada ocasión.',
    lines: ['Multimarca', 'Mujer', 'Hombre'] },
  { slug: 'manhattan', cover: 'Dfr0DW_gECQ:0', name: 'Manhattan', cat: 'moda', where: 'Local 52', ig: 'manhattan.bolivia',
    posts: ['Dfr0DW_gECQ', 'Dfn42btjO9H'],
    about: 'Marca boliviana de camisería y moda masculina: camisas, poleras tipo polo y prendas para una imagen profesional y cómoda.',
    lines: ['Camisas', 'Poleras tipo polo', 'Moda corporativa'] },
  { slug: 'textilon', cover: 'Dfp8QskjlrY:0', name: 'Textilón', cat: 'moda', ig: 'textilon.oficial', whatsapp: '59175011152',
    posts: ['DfkFqjxlBHp', 'Dfe8EyFCZUG', 'DfZ2WdqDsvY'],
    about: 'Marca boliviana con casi 60 años de trayectoria en ropa interior, pijamas y básicos. Tiendas en La Paz, Santa Cruz, Cochabamba y Tarija, con envíos a toda Bolivia.',
    lines: ['Ropa interior', 'Pijamas', 'Polos y básicos'] },
  { slug: 'womensecret', cover: 'DfkGPwYEw7A:0', name: 'women’secret', cat: 'belleza',
    posts: ['DfkGPwYEw7A'],
    about: 'Marca española de lencería, pijamas y moda de baño. Su colección Sunset Glam Primavera-Verano ’26 combina moda de baño y glamour.',
    lines: ['Lencería', 'Pijamas', 'Moda de baño'] },
  { slug: 'o-boticario', cover: 'DfpOdUiRyUt:0', name: 'O Boticário', cat: 'belleza', where: '1er piso · #49', ig: 'oboticario',
    about: 'La marca brasileña de belleza fundada en 1977: perfumes, maquillaje y cuidado de la piel y el cabello.',
    lines: ['Perfumes', 'Maquillaje', 'Cuidado de la piel', 'Cuidado del cabello'] },
  { slug: 'carrasco', cover: 'DbmEfL7J6D8:0', name: 'Joyería Carrasco', cat: 'belleza', ig: 'joyeriacarrasco', tiktok: '7705912235612278034',
    about: 'Joyeros desde 1927 y especialistas en diamantes. Oro 18K, plata y piezas para cada momento importante.',
    lines: ['Diamantes', 'Oro 18K', 'Plata', 'Anillos de compromiso'] },
  { slug: 'chilli-beans', cover: 'DfkZKQCINN2:0', name: 'Chilli Beans', cat: 'belleza',
    posts: ['DfkZKQCINN2'],
    about: 'Marca brasileña de lentes de sol, armazones y relojes con diseño atrevido y colaboraciones únicas.',
    lines: ['Lentes de sol', 'Armazones', 'Relojes'] },
  { slug: 'opticas-pauker', cover: 'Dfk_Q57O7rA:0', name: 'Ópticas Pauker', cat: 'belleza', ig: 'opticaspaukerbolivia', tiktok: '7702190696136150290',
    about: 'Cadena boliviana de ópticas fundada en Santa Cruz en 1989: monturas, lentes de sol y lentes recetados.',
    lines: ['Monturas', 'Lentes de sol', 'Lentes recetados'] },
  { slug: 'kids-collection', cover: 'Dfr1EUqRkka:0', name: 'Kids Collection', cat: 'ninos', ig: 'kidscollectionbo',
    posts: ['DfnqsxIkUf9', 'DfkTpgtD2TG'],
    about: 'Tienda de ropa para niños y niñas y accesorios para bebés, con marcas como OshKosh B’gosh.',
    lines: ['Niñas', 'Niños', 'Bebés', 'OshKosh B’gosh'] },
  { slug: 'baby-corp', cover: 'DfiT_u2oK_J:0', name: 'Baby Corp', cat: 'ninos', ig: 'babycorp_bolivia',
    posts: ['DfpZ0s2FC42'],
    about: 'La tienda para bebés más grande de Bolivia, desde 2002. Moda infantil, cochecitos, mobiliario y todo para los primeros años.',
    lines: ['Moda infantil', 'Cochecitos', 'Mobiliario', 'Accesorios'] },
  { slug: 'mariposa', cover: 'DfkoksPDYnm:3', name: 'Mariposa Gift Shop', cat: 'ninos', where: 'Piso 1 · Local 4', ig: 'mariposagiftshop.scz', whatsapp: '59171375733',
    posts: ['DfkoksPDYnm', 'Dffe_dOCJNt', 'DfaVZSbjCgo'],
    about: 'Tienda de regalos con alcancías, coleccionables, peluches, libros de cocina y detalles para cada ocasión.',
    lines: ['Regalos', 'Coleccionables', 'Libros', 'Alcancías'] },
  { slug: 'churromania', cover: 'DesPc6joZtS:0', name: 'Churromanía', cat: 'gastronomia', where: 'Primer piso', ig: 'churromaniabolivia',
    posts: ['DfkHRWTxzX0'],
    about: 'Churros recién hechos desde 1997 y poseedores de un récord Guinness. Probá el TwistMania en el primer piso.',
    lines: ['Churros', 'TwistMania', 'Bebidas'] },
  { slug: 'spacio-medico', cover: 'Dfm4RqMlG_l:0', name: 'Spacio Médico', cat: 'servicios', where: 'Nivel 2', ig: 'spaciomedico.bo',
    posts: ['Dfm4RqMlG_l'],
    about: 'Centro de salud y bienestar en el Nivel 2: consultas, controles, odontología y campañas de prevención como la medición de glucosa.',
    lines: ['Consultas', 'Odontología', 'Controles preventivos'] },
];

// ── Boulevard ────────────────────────────────────────────────
export const restaurants = [
  { slug: 'fogo-de-chao', cover: 'Dfp4sDXDj42:0', name: 'Fogo de Chão', cuisine: 'Churrasquería brasileña', ig: 'fogo', wa: 'https://wa.link/5n27qf', phone: '74621200',
    posts: ['Dfp4sDXDj42', 'DfnmuCTkdjC'], featured: true,
    about: 'Su primer restaurante en Bolivia: una parrilla abierta en el centro del salón con vista de 360° a los chefs gaúchos que cortan y asan a la espada. Market Table, Bar Fogo y Rodizio Ejecutivo al mediodía.', // [fogo]
    menu: ['Cortes premium a la espada', 'Market Table', 'Rodizio Ejecutivo', 'Bar Fogo'] },
  { slug: 'hard-rock-cafe', cover: 'DfhbRc4ll1m:0', name: 'Hard Rock Cafe', cuisine: 'Americana · Música en vivo', ig: 'hardrockcafescz', wa: 'https://wa.me/59177209923', featured: true,
    about: 'Hamburguesas legendarias, cócteles y noches de tributos en vivo, rodeados de memorabilia del rock.',
    menu: ['Burgers', 'Cócteles', 'Tributos en vivo', 'Rock Shop'] },
  { slug: 'fiesta-peru', cover: 'Dfsa4Dxi3b1:0', name: 'Fiesta Perú', cuisine: 'Cocina peruana', ig: 'fiestaperu.bo', wa: 'https://wa.link/2kf8v1', phone: '77388700',
    about: 'Un rincón de Perú en Santa Cruz: ceviches, ají de gallina, picante de langostinos, danzas y música criolla.',
    menu: ['Ceviche', 'Ají de gallina', 'Picante de langostinos', 'Pisco sour'] },
  { slug: 'regiones', cover: 'DfhHEbjBjcC:0', name: 'Regiones', cuisine: 'Cocina boliviana', ig: 'regionesbolivia', wa: 'https://wa.link/42gi23', phone: '62242200',
    about: 'Restaurante turístico con lo mejor de toda Bolivia sin salir de Santa Cruz. Barra chiquitana y cena-show con danzas todos los fines de semana.',
    menu: ['Picante de pollo', 'Sopas de Bolivia', 'Barra chiquitana', 'Cena-show'] },
  { slug: 'bahiana', cover: 'Dfhwf9_G4-j:1', name: 'Bahiana', cuisine: 'Restaurante & bar tropical', ig: 'bahiana.scz', wa: 'https://wa.me/59178242852',
    about: 'Tu punto de encuentro favorito: cócteles, gastronomía y música en un ambiente tropical. Vení como sos.',
    menu: ['Cócteles de autor', 'Burgers', 'Margarita Frozen', 'Noches temáticas'] },
  { slug: 'route66', cover: 'DfSuZmiDjFf:0', name: 'Route66', cuisine: 'Americana & cócteles', ig: 'route66_bolivia', wa: 'https://wa.link/x3v91s',
    hours: 'Lun–Mié 11:30–23:00 · Jue–Sáb 11:30–00:00 · Dom 8:00–23:00',
    about: 'Buffet de los sábados, cócteles de autor como el Mariposa Gin y jueves de magia en el Boulevard.',
    menu: ['Buffet libre', 'Cócteles de autor', 'Postres', 'Noches de magia'] },
  { slug: 'vaca-morena', cover: 'DeCtO9LgFWE:0', name: 'Vaca Morena', cuisine: 'Steakhouse', ig: 'vaca_morena', wa: 'https://wa.link/v0du5q',
    about: 'Steakhouse cruceño: tomahawk, cortes a la parrilla, milanesas y cócteles de autor como el Muuujito.',
    menu: ['Tomahawk', 'Cortes a la parrilla', 'Milanesas', 'Cócteles'] },
  { slug: 'bestial', cover: 'DfFLEwanElH:1', name: 'El Cuartito Bestial', cuisine: 'Burgers & cocina del mundo', ig: 'elcuartitobestial', wa: 'https://wa.me/59176623913',
    hours: 'Dom–Mié 11:00–23:30 · Jue–Sáb 11:00–00:30',
    about: 'Comida de distintos rincones del mundo y “La Bestia de la Semana”: una burger nueva a precio especial cada semana.',
    menu: ['La Bestia de la Semana', 'Baconzilla', 'Burger Brava’s', 'Pizzas'] },
  { slug: 'el-cuartito', cover: 'DfXbQM8lij6:0', name: 'El Cuartito', cuisine: 'Pizzas, burgers & bar', ig: 'elcuartito.bo', wa: 'https://wa.me/59176623913',
    about: 'Pizzas, burgers y la mejor vibra para armar la mesa con los tuyos, al lado de El Cuartito Bestial.',
    menu: ['Pizza Matute', 'Burgers', 'Baldes de cerveza'] },
  { slug: 'kaos', cover: 'DaOnChKH5jq:0', name: 'KAOS', cuisine: 'Resto bar', ig: 'kaos_ventura', wa: 'https://wa.link/m1yu9w',
    hours: 'Lun–Dom 11:00–3:00',
    about: 'Resto bar del Boulevard: Happy Lunch de burgers y papas brutales de 12:00 a 17:00, partidos y noches largas.',
    menu: ['Happy Lunch', 'Burgers', 'Papas brutales', 'Cerveza bien fría'] },
  { slug: 'republica', cover: 'B5I0vAyphcF:0', name: 'República', cuisine: 'Restaurante & bar', ig: 'republicascz', wa: 'https://wa.link/rql8w2',
    about: 'Un espacio con arte, con vida, con opciones: burgers, chopp y buena compañía.',
    menu: ['Burgers', 'Chopp', 'Promos'] },
  { slug: 'cinnabon', cover: 'De4TCJiCbd4:1', name: 'Cinnabon', cuisine: 'Postres & café', ig: 'cinnabonbolivia',
    about: 'El rollo de canela más famoso del mundo, con mucho frosting, combos y bebidas frías.',
    menu: ['Classic Roll', 'Minibon', 'Combos', 'Chillattas'] },
];

// ── Events (Ruta Boulevard) ─────────────────────────────────
export const events = [
  { title: 'Grupo KLASS', when: 'Viernes · 21:00', where: 'Área Verde', text: 'Clásicos del pop en inglés y español.', post: 'DfpeFtYjicV' },
  { title: 'Hnos. Barbery', when: 'Sábado · 21:00', where: 'Costanera', text: 'Música en vivo en el Boulevard de Luz.', post: 'DfcYRBhDrAd' },
  { title: 'Ángel Royo', when: 'Viernes', where: 'Área Verde', text: 'Una noche iluminada por la música.', post: 'DfaB85ijlIm' },
  { title: 'Ventura Kids', when: 'Domingo', where: 'Atrio Principal', text: 'Los pequeños se convierten en creadores.', post: 'Dfcy4LTCXt9' },
];

export const experiences = [
  { title: 'Ruta Boulevard', text: 'Música en vivo en el Área Verde y la Costanera, con la gastronomía y el encanto del Boulevard de Luz.', post: 'DfbUIfdDVTz', i: 0 },
  { title: '13 salas de cine', text: 'Incluida una sala IMAX de 16 metros de alto y 21 de ancho, y cuatro salas VIP.', mall: 'mall-interior' },
  { title: 'Ventura Sur', text: 'Nuestro nuevo mall ya está abierto. Gran inauguración oficial el 28 de noviembre.', post: 'Dfkc3EdieT_', i: 0 },
];


export const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
export const storeBySlug = (s) => stores.find((x) => x.slug === s);
export const restaurantBySlug = (s) => restaurants.find((x) => x.slug === s);

// WhatsApp funnel — each intent goes to a real WhatsApp line.
export const funnel = [
  { id: 'reserva', label: 'Reservar en el Boulevard', icon: '🍽️', ask: '¿En qué restaurante?', options: restaurants.filter((b) => b.wa).map((b) => ({ label: b.name, href: b.wa, msg: `Hola ${b.name}, quiero hacer una reserva (vengo desde venturamall.bo).` })) },
  { id: 'evento', label: 'Eventos y Ruta Boulevard', icon: '🎶', href: `https://wa.me/${mall.whatsapp.number}`, msg: 'Hola, quiero información sobre los eventos de Ruta Boulevard en Ventura Mall.' },
  { id: 'tiendas', label: 'Consultar a una tienda', icon: '🛍️', ask: '¿Qué tienda?', options: stores.filter((s) => s.whatsapp || s.catalog).map((s) => ({ label: s.name, href: s.whatsapp ? `https://wa.me/${s.whatsapp}` : s.catalog, msg: `Hola ${s.name}, tengo una consulta (vengo desde venturamall.bo).` })) },
  { id: 'general', label: 'Información general', icon: 'ℹ️', href: mall.phoneHref, note: `Llamá al ${mall.phone} o escribí a ${mall.email}` },
];
