// Legal & help pages: /legal/:slug and /ayuda
import gsap from 'gsap';
import { mall, legalPages, legalUpdated, restaurants } from '../content.js';
import { $, $$, esc, icons, reduced } from '../ui.js';
import { pageHeroIntro } from './directory.js';

const contact = `<p>Ventura Mall · ${esc(mall.address)}, ${esc(mall.city)} · Teléfono <a href="${mall.phoneHref}">${esc(mall.phone)}</a> · <a href="mailto:${mall.email}">${esc(mall.email)}</a></p>`;

const PAGES = {
  terminos: {
    lead: 'Las reglas para usar este sitio web y sus servicios: el directorio, las páginas de tiendas y restaurantes, Marvin y los enlaces de reserva.',
    body: `
<h2>1. Sobre este sitio</h2>
<p>Este sitio web informa sobre Ventura Mall (Equipetrol Norte, Santa Cruz de la Sierra): sus tiendas, el Boulevard, eventos, horarios y cómo llegar. Al navegarlo aceptás estos términos. Si no estás de acuerdo, por favor no lo uses.</p>

<h2>2. Información de tiendas y restaurantes</h2>
<p>Cada tienda y restaurante es un comercio independiente y es responsable de sus productos, servicios, precios, promociones, stock, reservas y atención. La información que mostramos (fotos, platos, promociones, horarios) proviene de sus publicaciones oficiales y de @venturamalloficial, y es <strong>referencial</strong>: puede cambiar sin aviso. Antes de comprar o reservar, confirmá los detalles directamente con el local.</p>
<p>Las promociones tienen las condiciones, vigencia y restricciones que defina cada comercio. Ventura Mall no garantiza su disponibilidad.</p>

<h2>3. Reservas y contacto por WhatsApp</h2>
<p>Los botones "Reservar" y "WhatsApp" abren una conversación con el comercio o con el mall en WhatsApp, un servicio de Meta con sus propios términos. La reserva o compra es un acuerdo entre vos y el comercio.</p>

<h2>4. Marvin, el recepcionista virtual</h2>
<p>Marvin es un asistente de inteligencia artificial que responde preguntas sobre el mall a partir de la información publicada en este sitio. Puede equivocarse o tener datos desactualizados; sus respuestas son orientativas y no constituyen una oferta, reserva ni compromiso del mall ni de los comercios. No compartas con Marvin datos personales sensibles (documentos, tarjetas, contraseñas). Ver la <a href="/legal/privacidad">Política de privacidad</a>.</p>

<h2>5. Uso permitido</h2>
<p>Podés usar el sitio para fines personales e informativos. No está permitido usarlo para fines ilícitos, intentar acceder a sus sistemas sin autorización, interferir con su funcionamiento, automatizar consultas masivas a Marvin ni copiar su contenido con fines comerciales sin permiso.</p>

<h2>6. Propiedad intelectual</h2>
<p>El diseño y los textos de este sitio pertenecen a Ventura Mall. Los nombres, logotipos y fotografías de cada tienda y restaurante son propiedad de sus respectivos titulares y se muestran solo para identificarlos. Las fotos del edificio provienen de Wikimedia Commons bajo licencia CC BY-SA. Ver el <a href="/legal/aviso-legal">Aviso legal</a>.</p>

<h2>7. Enlaces a terceros</h2>
<p>El sitio enlaza a Instagram, TikTok, Facebook, WhatsApp, Google Maps y sitios de las marcas. No controlamos esos servicios ni somos responsables de su contenido o de sus políticas.</p>

<h2>8. Responsabilidad</h2>
<p>Hacemos lo posible para que el sitio esté disponible y la información sea correcta, pero no garantizamos que esté libre de errores o interrupciones. En la medida que lo permita la ley, Ventura Mall no responde por daños derivados del uso del sitio o de decisiones tomadas en base a información referencial. Nada de lo anterior limita los derechos que te reconoce la normativa boliviana de protección al consumidor.</p>

<h2>9. Cambios</h2>
<p>Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización.</p>

<h2>10. Ley aplicable</h2>
<p>Estos términos se rigen por las leyes del Estado Plurinacional de Bolivia. Cualquier controversia se someterá a las autoridades competentes de Santa Cruz de la Sierra.</p>

<h2>11. Contacto</h2>
${contact}`,
  },

  privacidad: {
    lead: 'Qué datos se tratan cuando usás este sitio, para qué y cuáles son tus derechos.',
    body: `
<h2>1. Responsable</h2>
${contact}

<h2>2. Qué datos tratamos</h2>
<ul>
<li><strong>Navegación:</strong> el servidor que aloja el sitio (Vercel) registra datos técnicos como dirección IP, navegador, páginas solicitadas y hora, para operar el sitio y protegerlo frente a abusos.</li>
<li><strong>Conversaciones con Marvin:</strong> lo que escribís en el chat se envía, junto con los mensajes anteriores de esa conversación, a Anthropic (proveedor del modelo de inteligencia artificial Claude) para generar la respuesta. El sitio no guarda tus conversaciones en una base de datos propia; la conversación se borra al cerrar o recargar la página. Los registros técnicos del servidor pueden contener errores puntuales.</li>
<li><strong>WhatsApp, teléfono y email:</strong> si nos escribís o escribís a un comercio, los datos que compartas los trata quien recibe el mensaje, a través de esos servicios.</li>
<li><strong>Preferencias en tu navegador:</strong> guardamos en tu propio dispositivo (almacenamiento local) que ya viste el aviso de cookies. Ver la <a href="/legal/cookies">Política de cookies</a>.</li>
</ul>
<p>El sitio no tiene formularios de registro y no te pide datos personales para navegarlo.</p>

<h2>3. Para qué los usamos</h2>
<p>Para mostrarte el sitio, responder tus consultas, mantener la seguridad del servicio y mejorar la información publicada. No vendemos tus datos ni los usamos para publicidad personalizada.</p>

<h2>4. Con quién se comparten</h2>
<p>Con proveedores que prestan el servicio: Vercel (alojamiento), Anthropic (respuestas de Marvin) y, cuando los usás, Google (mapas y tipografías), TikTok (reproductor de videos), Instagram/Meta y WhatsApp. Cada uno trata los datos según su propia política de privacidad. Algunos de estos proveedores operan fuera de Bolivia.</p>

<h2>5. Cuánto tiempo</h2>
<p>Los registros técnicos se conservan el tiempo necesario para operar y proteger el sitio según los plazos de cada proveedor. Las conversaciones con Marvin no se guardan en el sitio.</p>

<h2>6. Tus derechos</h2>
<p>La Constitución Política del Estado reconoce tu derecho a la privacidad y a conocer, rectificar y eliminar datos sobre vos (arts. 21 y 130). Para ejercerlos o hacer cualquier consulta, escribinos a <a href="mailto:${mall.email}">${esc(mall.email)}</a>.</p>

<h2>7. Menores de edad</h2>
<p>El sitio es para público general. Pedimos que los menores lo usen con supervisión de un adulto y no compartan datos personales en el chat.</p>

<h2>8. Cambios</h2>
<p>Si cambia la forma en que tratamos datos, actualizaremos esta página y su fecha.</p>`,
  },

  cookies: {
    lead: 'Qué guarda este sitio en tu navegador y qué servicios de terceros pueden usar cookies.',
    body: `
<h2>1. Cookies propias</h2>
<p>Ventura Mall no usa cookies propias de seguimiento, publicidad ni analítica. Solo guardamos en el almacenamiento local de tu navegador una marca de que aceptaste el aviso, para no mostrártelo de nuevo. Es esencial y no te identifica.</p>

<h2>2. Servicios de terceros</h2>
<p>Algunas partes del sitio cargan contenido de otros servicios que pueden usar sus propias cookies o tecnologías similares:</p>
<ul>
<li><strong>Google Maps</strong> — el mapa de la sección "Visítanos".</li>
<li><strong>Google Fonts</strong> — las tipografías del sitio.</li>
<li><strong>TikTok</strong> — solo cuando reproducís un video con su reproductor.</li>
<li><strong>Instagram, Facebook, WhatsApp y sitios de marcas</strong> — solo si abrís sus enlaces.</li>
</ul>
<p>Esas cookies las controla cada proveedor según su política.</p>

<h2>3. Cómo gestionarlas</h2>
<p>Podés bloquear o borrar cookies y el almacenamiento local desde la configuración de tu navegador. El sitio seguirá funcionando; solo puede que el mapa o algunos videos no se muestren.</p>`,
  },

  'aviso-legal': {
    lead: 'Datos del titular del sitio, propiedad intelectual y créditos.',
    body: `
<h2>1. Titular del sitio</h2>
${contact}

<h2>2. Alojamiento</h2>
<p>El sitio está alojado en Vercel Inc.</p>

<h2>3. Propiedad intelectual y marcas</h2>
<p>Ventura Mall y su logotipo son marcas de su titular. Los nombres comerciales, marcas y logotipos de las tiendas y restaurantes (por ejemplo BOSS, Calvin Klein, Fogo de Chão o Hard Rock Cafe) pertenecen a sus respectivos dueños y se muestran únicamente para identificar a los comercios presentes en el mall. Su aparición no implica una relación distinta de la de locatario.</p>

<h2>4. Créditos de fotos y videos</h2>
<ul>
<li>Publicaciones de <a href="${mall.socials.instagram.url}" target="_blank" rel="noopener">@venturamalloficial</a> en Instagram y TikTok.</li>
<li>Cuentas oficiales de cada tienda y restaurante, indicadas en su página.</li>
<li>Fotos del edificio: <a href="https://commons.wikimedia.org/wiki/Category:Ventura_Mall,_Santa_Cruz_de_la_Sierra" target="_blank" rel="noopener">Wikimedia Commons</a>, licencia CC BY-SA.</li>
</ul>
<p>Si sos titular de algún contenido y querés que lo retiremos o corrijamos un crédito, escribinos a <a href="mailto:${mall.email}">${esc(mall.email)}</a>.</p>

<h2>5. Más información</h2>
<p>Ver los <a href="/legal/terminos">Términos y condiciones</a>, la <a href="/legal/privacidad">Política de privacidad</a> y la <a href="/legal/cookies">Política de cookies</a>.</p>`,
  },

  accesibilidad: {
    lead: 'Queremos que todas las personas puedan usar este sitio.',
    body: `
<h2>1. Nuestro objetivo</h2>
<p>Trabajamos para cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA.</p>

<h2>2. Lo que ya hicimos</h2>
<ul>
<li>Si tu dispositivo tiene activada la opción de reducir movimiento, desactivamos las animaciones, el desplazamiento suave y el carrusel automático.</li>
<li>Se puede navegar con teclado; hay un enlace para saltar al contenido y los elementos activos muestran el foco.</li>
<li>Las fotos de tiendas y restaurantes tienen texto alternativo.</li>
<li>Los videos empiezan sin sonido y tienen un botón para activarlo.</li>
<li>El texto usa colores con buen contraste sobre el fondo oscuro.</li>
</ul>

<h2>3. Limitaciones conocidas</h2>
<ul>
<li>Los videos provienen de redes sociales y no tienen subtítulos.</li>
<li>Algunas imágenes promocionales de los comercios incluyen texto dentro de la imagen.</li>
<li>El mapa y el reproductor de TikTok son servicios de terceros.</li>
</ul>

<h2>4. Contanos</h2>
<p>Si encontrás una barrera, escribinos a <a href="mailto:${mall.email}">${esc(mall.email)}</a> o llamá al <a href="${mall.phoneHref}">${esc(mall.phone)}</a>. Lo vamos a revisar.</p>`,
  },
};

const FAQ = [
  ['¿Qué horario tiene Ventura Mall?', mall.hours.map((h) => `${h.label}: ${h.value}`).join('. ') + '.'],
  ['¿Dónde queda?', `${mall.address}, ${mall.city}. En la sección <a href="/#visita">Visítanos</a> tenés el mapa y el botón "Cómo llegar".`],
  ['¿Cómo reservo en un restaurante del Boulevard?', `Entrá a <a href="/boulevard">el Boulevard</a>, elegí el restaurante y tocá "Reservar por WhatsApp". Hay ${restaurants.length} restaurantes y bares.`],
  ['¿Cómo contacto a una tienda?', 'En la página de cada tienda (desde <a href="/tiendas">Tiendas</a>) están su ubicación, su Instagram y, si tiene, su WhatsApp o catálogo.'],
  ['¿Quién es Marvin?', 'Marvin es nuestro recepcionista virtual: un asistente de inteligencia artificial que responde sobre horarios, tiendas, menús del Boulevard y eventos. Tocá el botón de chat abajo a la derecha. Puede equivocarse, así que confirmá lo importante con el local.'],
  ['¿Dónde veo los eventos y la música en vivo?', 'En <a href="/#eventos">Ruta Boulevard</a> y en nuestras redes @venturamalloficial, donde publicamos la agenda de cada semana.'],
  ['¿Qué es Ventura Sur?', 'Es el nuevo mall del grupo. Ya abrió al público y su inauguración oficial es el 28 de noviembre.'],
  ['Perdí algo / tengo otra consulta', `Llamanos al <a href="${mall.phoneHref}">${esc(mall.phone)}</a>, escribinos a <a href="mailto:${mall.email}">${esc(mall.email)}</a> o usá el botón verde de WhatsApp.`],
];

function shell({ kicker, title, lead, body, current }) {
  return `
  <header class="page-hero page-hero--legal">
    <div class="page-hero__bg page-hero__bg--grad" aria-hidden="true"></div>
    <div class="page-hero__inner">
      <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><span aria-current="page">${esc(title)}</span></nav>
      <p class="kicker">( ${esc(kicker)} )</p>
      <h1 class="page-title page-title--legal"><span class="line"><span class="split">${esc(title)}</span></span></h1>
      <p class="page-lead">${esc(lead)}</p>
    </div>
  </header>
  <section class="legal">
    <aside class="legal__nav" aria-label="Información legal">
      <b>Información</b>
      ${legalPages.map((l) => `<a href="/legal/${l.slug}"${l.slug === current ? ' aria-current="page"' : ''}>${esc(l.title)}</a>`).join('')}
      <a href="/ayuda"${current === 'ayuda' ? ' aria-current="page"' : ''}>Preguntas frecuentes</a>
    </aside>
    <article class="legal__body">
      ${body}
      <p class="legal__updated">Última actualización: ${legalUpdated}</p>
    </article>
  </section>`;
}

function mountLegal(main) {
  pageHeroIntro(main);
  if (!reduced) gsap.from($$('.legal__body > *', main).slice(0, 8), { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.3 });
}

export function legalView(slug) {
  const meta = legalPages.find((l) => l.slug === slug);
  const page = PAGES[slug];
  if (!meta || !page) return null;
  return {
    page: 'legal',
    title: `${meta.title} — Ventura Mall`,
    description: page.lead,
    html: shell({ kicker: 'Legal', title: meta.title, lead: page.lead, body: page.body, current: slug }),
    mount({ main }) { mountLegal(main); },
  };
}

export function helpView() {
  const body = `<div class="faq">${FAQ.map(([q, a], i) => `<details class="faq__item"${i === 0 ? ' open' : ''}><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div>
    <div class="faq__cta">
      <p>¿No encontrás lo que buscás?</p>
      <button class="btn" data-open-chat-proxy data-magnetic><span>Preguntale a Marvin</span>${icons.arrow}</button>
      <button class="btn btn--ghost" data-open-funnel data-magnetic><span>Escribinos por WhatsApp</span></button>
    </div>`;
  return {
    page: 'legal',
    title: 'Preguntas frecuentes — Ventura Mall',
    description: 'Horarios, cómo llegar, reservas en el Boulevard, Marvin y contacto de Ventura Mall.',
    html: shell({ kicker: 'Ayuda', title: 'Preguntas frecuentes', lead: 'Lo que más nos preguntan. Para todo lo demás, Marvin te responde al instante.', body, current: 'ayuda' }),
    mount({ main }) {
      mountLegal(main);
      $('[data-open-chat-proxy]', main)?.addEventListener('click', () => document.querySelector('[data-open-chat]')?.click());
    },
  };
}
