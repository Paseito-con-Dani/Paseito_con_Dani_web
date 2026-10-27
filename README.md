# Paseíto con Dani · Sitio web oficial

Sitio estático (HTML, CSS y JavaScript, sin dependencias) para GitHub Pages, construido sobre el **Brand Book v2** de Paseíto con Dani.
Desarrollado por **Makhana**.

## Estructura

```
index.html                 Página única con las 7 secciones
assets/css/styles.css      Sistema visual (paleta, jerarquía Oswald 600/500/400/300, Arimo, Courier Prime)
assets/js/config.js        ⭐ TODO lo editable: estreno, experiencias, catálogo, pagos, contacto, endpoints
assets/js/main.js          Lógica: mapas ilustrados, cuenta regresiva, calendario, tienda, carrito, formularios
assets/js/map-data.js      Mapa de Venezuela por estados (datos Natural Earth, dominio público)
assets/svg/                Logos de Paseíto con Dani y de El Reseteo (vector)
assets/img/                Fotos (WEBP) y pictogramas
assets/fonts/              Oswald, Arimo y Courier Prime (licencia SIL OFL)
apps-script/Code.gs        Receptor de formularios en Google Sheets + aviso por correo
```

## Cómo actualizar el contenido (sin tocar código)

Todo se edita en `assets/js/config.js`:

- **Estreno de YouTube:** `youtube.estreno` (fecha y hora de Venezuela). Al llegar a cero, el título cambia a "¡Ya estamos al aire!" y, si pones `youtube.videoId`, se muestra el video.
- **Experiencias:** agrega o edita objetos en `experiencias`. Con `revelado: false` aparece "Destino por revelar" (campañas de intriga). `estado`: `abierto` (acepta registros), `pronto` o `agotado`.
- **Catálogo:** `productos`. Con `precioUSD: null` aparece "Precio por anunciar" y no se puede comprar. ⚠️ Cargar los precios oficiales antes de abrir ventas.
- **Pagos (Fase 2):** datos de Pago móvil, Zelle y Binance en `pagos.metodos`.
- **Contacto y redes:** `contacto`. Enlace del logo de Makhana: `creditos.makhanaUrl`.

## Conectar los formularios (Fase 1)

1. Con la cuenta técnica **web@** del Workspace, sigue las instrucciones al inicio de `apps-script/Code.gs`.
2. Pega la URL de la aplicación web en `config.js → endpoints.registro` y `endpoints.aliados`.
3. Sin URL, los formularios funcionan en **modo demostración** (no envían nada y lo avisan en pantalla).

## Publicar en GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. Para el dominio propio: archivo `CNAME` con el dominio y registros DNS en Cloudflare (ver guía de Makhana).

## Pendientes antes de publicar

- [ ] Confirmar hora del estreno (hoy: 13 nov 2026, 7:00 p. m.).
- [ ] Precios oficiales del catálogo y datos de pago.
- [ ] Endpoints de Apps Script.
- [ ] Reemplazar fotos momentáneas por las definitivas en alta.
- [ ] Logo vectorial original de El Reseteo (el actual es una reconstrucción a partir de una captura).
