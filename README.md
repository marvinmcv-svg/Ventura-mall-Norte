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

## Contenido para reemplazar

- **`src/data.js`**: marcas, categorías, horarios y dirección. La lista de marcas viene de notas de prensa públicas y **debe validarse** con el equipo comercial. Para usar el logo oficial de una marca, agrega `logo: '/brands/nombre.svg'`.
- **`public/media/`**: las fotos actuales son **imágenes de stock de Unsplash, de uso libre, puestas como referencia**. No son fotos de Ventura Mall. Reemplázalas por fotos y videos oficiales con el mismo nombre de archivo.
- **Estadísticas** (`index.html`, sección `.stats`): 30+ marcas, 2.000+ estacionamientos y 21 locales de comida, según la prensa de apertura. Hay que verificarlas.
