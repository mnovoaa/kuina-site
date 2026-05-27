# KUINA — sitio

Sitio de KUINA. HTML/CSS/JS puro, sin build ni dependencias.

## Estructura
```
index.html        → home (hero + diario resumido + reproductor real)
galeria.html      → galería (mosaico + lightbox)
musica.html       → música (discografía real + reproductor de audio)
diario.html       → índice del diario (fecha + lead)
diario-1..4.html  → cada entrada del diario, individual
tour.html         → fechas del Por Siempre Tour (links de venta reales)
info.html         → bio, stats, redes y contacto
assets/           → fotos (tono celeste), audio y garabatos en PNG transparente
```

## Ver en local
Abrir `index.html`. Mantener los archivos JUNTOS en la misma carpeta — la navegación y las imágenes dependen de eso.

## Desplegar en Vercel
1. Repo en GitHub (este).
2. vercel.com → Add New → Project → importar el repo.
3. Framework preset: **Other**. Sin build command ni output dir.
4. Deploy.

O con la CLI: `vercel` dentro de la carpeta.

## Navegación
- Menú "Diario" → diario.html (índice con las cuatro entradas)
- "Leer más" en la home → diario-1.html
- Desde una entrada, "← diario" vuelve al índice; "volver al inicio" vuelve a index.html
- La intro de index.html ("no es un personaje…") solo se reproduce la primera visita por sesión (sessionStorage). Volver al inicio después entra directo al hero.

---

## Cambios recientes

### Agregado
- **Reproductor real en home**: reproduce `kontando-el-tiempo.mp3` con la misma waveform RMS de la sección Música. Control de play/pause, click en la onda para saltar de posición, tiempo actual/total. Mute toggle + slider de volumen (slider oculto en mobile, deja solo el mute tap binario). Memoria del último volumen al des-mutear.
- **Borde de papel rasgado** (SVG `feTurbulence` + `feDisplacementMap`) en la transición hero → diario: el diario aparece como una hoja sobre la oscuridad en lugar de fundirse cromáticamente.
- **Partículas de polvo cruzando la frontera silence/diario**: 10 partículas extra nacen en el seam y derivan hacia el hero, sugiriendo atmósfera compartida entre los dos mundos.
- **Curita en la foto del diario**: en esquina superior izquierda en diagonal, dibujado como line art (no fotorrealista) — contrasta con el conejo de la esquina inferior derecha.
- **Logo KUINA con reveal animation propia + breathing infinito** (antes la animación de breathing sobrescribía el reveal).
- **Meta tags por página**: `title` único, `description`, Open Graph (`og:title`, `og:image`, `og:type`), `twitter:card`, `theme-color` (azul `#262d38` para páginas oscuras, crema `#e9e7df` para diarios), favicon (conejo blanco/tinta según fondo).
- **Hamburger menu accesible**: SVG line art (reemplaza ☰), `aria-label`, `aria-expanded`, rotación 90° al abrir, cierre por tecla Escape.
- **Body scroll lock** cuando el menú mobile está abierto (`overflow:hidden; touch-action:none`).
- `loading="lazy"` y `decoding="async"` en imágenes diferidas (galería, portadas, conejos secundarios). `fetchpriority="high"` en imágenes críticas (hero, cover destacada, about).
- Override mobile de `nav.scrolled` para que el padding no salte al scrollear (era el bug principal de mobile).

### Eliminado
- **Bloque de álbum y subtítulo del hero**: el álbum vive en `musica.html` con su reproductor real. No se duplica en la home.
- **Sección `<section class="silence">` como bloque con gradiente propio**: ahora es solo `#262d38` plano de 22vh — la transición vive en el diario.
- **Gradiente del diario hacia crema**: vuelve a fondo crema sólido; el borde rasgado SVG hace el corte material en lugar de tonal.
- **Player decorativo no funcional** (sustituido por el reproductor real).
- **Intento de scotch tape blanco mal hecho** (sustituido por el curita line art).
- **Typo selector `#intro . tag{}`** con espacio espurio.
- **Decoración white-on-white sobre la foto** que sobresalía sin sentido visual.

### Arreglado
- **Navbar mobile que saltaba al scrollear** (sitewide): `nav.scrolled` tenía `padding:16/18px 50px` fuera del media query — en mobile el padding lateral pegaba un salto de 22px a 50px. Override `@media(max-width:760px/820px){nav.scrolled{padding:14px 22px}}` en las 10 páginas.
- **Menú mobile que se cortaba al pasar el hero**: causa raíz: `backdrop-filter` en `nav.scrolled` creaba un containing block para el `position:fixed` interno, así el `inset:0` del menú resolvía al box del nav (~60px) en lugar del viewport. Fix: `body.menu-open nav{backdrop-filter:none;background:transparent}` durante el estado abierto, con `setTimeout(500ms)` al cerrar para coincidir con la transición y evitar snap visual.
- **Logo KUINA aparecía instantáneo** (sin reveal blur): la animación `logoBreathe` en `.logo-kuina` sobrescribía la animación `rev` del `.reveal`. Solución: animaciones comma-separated (`logoReveal` + `logoBreathe`) con delays explícitos por animación.
- **Scroll listener sin throttling**: envuelto en `requestAnimationFrame` + `{passive:true}` en las 10 páginas.

---

## Pendientes
- Mail de contacto en `info.html` es placeholder (`contacto@kuina.cl`) — reemplazar por el real o quitar.
- Idioma EN (selector está, traducción no implementada).
- Más .mp3 → habilita el resto de portadas como reproducibles (hoy enlazan a Spotify).

Hecho por ShowUp.
