# Landing page — Malena Bustos, abogada penalista

Sitio de una sola página (one-page) para la Dra. Malena Bustos, abogada especialista
en derecho penal en Santiago del Estero, Argentina.

HTML, CSS y JavaScript puros: **sin build, sin dependencias, sin framework**.
Se publica subiendo los archivos tal cual a cualquier hosting estático.

## Estructura

```
index.html              Página completa (todas las secciones)
assets/css/styles.css   Estilos y diseño responsive
assets/js/main.js       Menú, métricas animadas, carrusel, animaciones
assets/img/perfil.svg   ← PLACEHOLDER de la foto de perfil
assets/img/og-image.svg ← PLACEHOLDER de la imagen para redes sociales
assets/img/favicon.svg  Ícono del navegador
robots.txt / sitemap.xml  SEO básico
```

Secciones de la página: perfil (hero) · trayectoria · valores + métricas ·
testimonios · preguntas frecuentes · contacto.

## Qué hay que reemplazar antes de publicar

Está todo marcado en el código con comentarios `TODO` / `PLACEHOLDER`.

| # | Qué | Dónde |
|---|-----|-------|
| 1 | **Foto profesional** | Guardar la foto como `assets/img/perfil.jpg` (recomendado ~900×1100 px) y cambiar `src="assets/img/perfil.svg"` por `src="assets/img/perfil.jpg"` en `index.html`. |
| 2 | **Métricas** (números de los gráficos circulares) | `index.html`, bloque `<div class="metrics">`. Los valores actuales son **inventados, solo para ver el diseño**. |
| 3 | **Testimonios** | `index.html`, bloque `<div class="slider">`. Los cinco testimonios actuales son de ejemplo. |
| 4 | **Respuestas de las FAQ** | `index.html`, sección `#faq`, y también dentro del bloque `application/ld+json` (hay que actualizar ambos para que coincidan). |
| 5 | **Dominio** | Hoy figura `https://malenabustos.com.ar/` como marcador en `<link rel="canonical">`, en las etiquetas Open Graph, en el JSON-LD, en `robots.txt` y en `sitemap.xml`. Reemplazar por el dominio real cuando esté. |
| 6 | **Matrícula profesional** | Cuando esté el dato, agregarlo en el pie de página (`.footer-legal`) y como `identifier` en el JSON-LD. |
| 7 | **Quitar el `noindex`** | Mientras el contenido sea provisorio, `index.html` lleva `<meta name="robots" content="noindex, nofollow">` para que Google no indexe la versión de prueba. Cambiarlo por `content="index, follow"` cuando el contenido sea el real. |
| 8 | **Imagen de redes** | Idealmente reemplazar `og-image.svg` por un **JPG o PNG de 1200×630 px**: varias redes (WhatsApp, Facebook) no renderizan SVG en las previsualizaciones. |

### Cómo editar los gráficos circulares

Cada métrica se configura con tres atributos:

```html
<div class="donut" data-value="180" data-suffix="+" data-progress="78">
```

- `data-value` — el número que se cuenta hacia arriba.
- `data-suffix` — lo que va después del número (`+`, `%`, ` h`, o vacío).
- `data-progress` — cuánto se rellena el anillo, de 0 a 100 (es visual: para un
  número que no es un porcentaje, elegir un valor que se vea bien).

## Datos de contacto configurados

- WhatsApp / teléfono: `+54 9 385 535-0594` (enlaces `wa.me/5493855350594`)
- Email: `malenabustos1@gmail.com`
- Instagram: [@malenabustos.abogada_](https://www.instagram.com/malenabustos.abogada_/)

Si alguno cambia, aparece en varios lugares de `index.html` (botones del hero,
tarjetas de contacto, botón flotante, pie de página y JSON-LD): conviene buscar y
reemplazar en todo el archivo.

## Ver el sitio en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

(Abrir `index.html` directamente con doble clic también funciona.)

## Publicar

**GitHub Pages:** en el repositorio, *Settings → Pages → Source: Deploy from a
branch*, elegir la rama y la carpeta `/ (root)`. El archivo `.nojekyll` ya está
incluido para que GitHub no procese el sitio con Jekyll.

**Netlify o Vercel:** arrastrar la carpeta o conectar el repositorio. No hay que
configurar comando de build ni carpeta de salida.

## Accesibilidad y rendimiento

- Navegación por teclado, enlace de salto al contenido y textos alternativos.
- Respeta `prefers-reduced-motion`: si la persona pidió menos animaciones,
  se desactivan el conteo, el carrusel automático y las apariciones.
- Sin librerías externas; la única petición a terceros son las tipografías de
  Google Fonts (se pueden autohospedar si se quiere evitar).

## Nota legal

El sitio incluye una leyenda aclarando que el contenido es informativo y no
constituye asesoramiento legal, y un recuadro con los teléfonos de emergencia
(911 y línea 144). Antes de publicar cifras de resultados o testimonios conviene
verificar las reglas de publicidad profesional del colegio de abogados
correspondiente; los testimonios deben publicarse anonimizados y con
consentimiento de cada persona.
