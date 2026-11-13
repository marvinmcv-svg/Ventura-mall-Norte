# Ventura Mall — sitio web

Sitio de una sola página para Ventura Mall (Equipetrol Norte, Santa Cruz de la Sierra).

**Stack:** Vite · GSAP + ScrollTrigger · Lenis (smooth scroll) · Three.js (hero de partículas en shaders)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # salida en dist/
```

## Secciones

1. **Preloader**: contador y apertura de cortina.
2. **Hero**: unas 18k partículas WebGL forman la palabra "VENTURA", se apartan al pasar el cursor y se dispersan en una galaxia al hacer scroll.
3. **Marquee de marcas**: se acelera, cambia de dirección y se inclina según la velocidad del scroll.
4. **Manifiesto**: las palabras se iluminan una a una al hacer scroll.
5. **Revelado con zoom**: la imagen del atrio se expande a pantalla completa y aparecen contadores.
6. **Categorías**: galería horizontal fijada (pinned) con parallax dentro de cada tarjeta.
7. **Directorio**: filtro por categoría, búsqueda y vista previa de imagen que sigue al cursor.
8. **Gastronomía**: columna fija (sticky) con imágenes en parallax que se revelan con clip-path.
9. **Experiencias**: tarjetas apiladas que se reducen al llegar la siguiente.
10. **Instagram**: anillo 3D de imágenes que gira con el scroll.
11. **Visítanos**: horarios, estado abierto/cerrado (hora de Bolivia), mapa y cómo llegar.
12. **Footer**: el wordmark gigante se ajusta al ancho del contenedor.

Incluye cursor personalizado, botones magnéticos, textura de grano y navegación que se oculta al bajar. Respeta `prefers-reduced-motion`.

## Contenido y fuentes

Todo el contenido de `src/data.js` tiene fuente, indicada en un comentario en cada línea:
- **[web]** venturamall.bo, copia archivada el 14 de marzo de 2026 (el sitio en vivo tiene el certificado SSL vencido). De ahí salen los horarios, el teléfono, el email, la dirección y las coordenadas.
- **[ig]** Publicaciones de @venturamalloficial del 8 al 13 de noviembre de 2026. De ahí salen las marcas, los eventos y Ventura Sur.

Solo se listan las marcas que aparecen en publicaciones oficiales. Se quitaron TGI Fridays, Hard Rock, P.F. Chang's, Cinemark y las cifras de estacionamientos y patio de comidas, porque no se pudieron verificar.

## Fotos y videos reales

`scripts/instagram-media.json` tiene 36 publicaciones reales: 14 reels y 88 fotos de carrusel. Para descargarlas junto con el logo oficial:

```bash
npm run fetch-media
```

Los archivos se guardan en `public/media/ig/` y `public/brand/`. Los enlaces de Instagram expiran a los pocos días; si el script da errores 403, hay que volver a extraer el feed.
