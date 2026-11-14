# Ventura Mall — sitio web

Sitio de Ventura Mall (Equipetrol Norte, Santa Cruz de la Sierra).

**Stack:** Vite · GSAP + ScrollTrigger · Lenis · Three.js · función serverless de Vercel para el asistente (Claude).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # salida en dist/
```

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero de partículas (VENTURA + MALL), manifiesto, cifras, categorías, tiendas destacadas, Boulevard, reels, Ruta Boulevard, experiencias, TikTok, comunidad y cómo llegar |
| `/tiendas` | Directorio completo con filtros por categoría y búsqueda (`?cat=moda&q=jeans`) |
| `/tiendas/:slug` | Página de cada tienda: ubicación, horario, contacto, sobre la marca, novedades en Ventura, productos (galería con lightbox), videos y tiendas relacionadas |
| `/boulevard` | Todos los restaurantes, con logo y foto real |
| `/boulevard/:slug` | Página de cada restaurante: reservas por WhatsApp, horario, platos y momentos, videos |

Las rutas usan URLs limpias; `vercel.json` reescribe todo lo que no sea `/api`, `/media` o `/assets` a `index.html`. El router (`src/router.js`) anima una cortina entre páginas y limpia las animaciones de cada vista al salir.

## Contenido

- `src/data.js`: todos los datos con su fuente (sitio oficial archivado, @venturamalloficial, la cuenta oficial de cada tienda y restaurante, atom.bio del Boulevard, Wikipedia). Solo se listan locales que aparecen en publicaciones oficiales.
- `src/content.js`: helpers que combinan los datos con las fotos y videos.
- `src/media.json`: manifiesto de medios (publicaciones, logos, TikToks, fotos del edificio).

## Fotos y videos

Todos los medios están **guardados en el repositorio** en `public/media/` (antes se descargaban al compilar desde enlaces de Instagram/TikTok que vencen en pocos días, por eso faltaban miniaturas):

- `media/logos/` — logo real de cada tienda y restaurante (avatar de su cuenta oficial). HUGO, Springfield, women'secret y Chilli Beans usan un rótulo tipográfico porque su avatar no servía.
- `media/ig/` — fotos (WebP) y videos (MP4 de 20 s, 540p) de @venturamalloficial y de las cuentas de cada local. Cada video tiene su miniatura.
- `media/tt/` — TikToks de @venturamalloficial con miniatura; los que no se pudieron descargar se reproducen con el reproductor de TikTok.
- `media/mall/` — fotos del edificio de Wikimedia Commons (CC BY-SA).

La portada de cada tienda/restaurante se eligió a mano (campo `cover` en `src/data.js`) para mostrar la imagen más representativa.
