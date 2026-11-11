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

- [ ] Confirmar hora del estreno (fecha: 15 nov 2026; hora provisional: 7:00 p. m.).
- [ ] Precios oficiales del catálogo y datos de pago.
- [ ] Endpoints de Apps Script.
- [ ] Reemplazar fotos momentáneas por las definitivas en alta.
- [ ] Logo vectorial original de El Reseteo (el actual es una reconstrucción a partir de una captura).

## Sistema web: formularios, Google Sheets y correos (v17)

Todo lo que la gente llena en el sitio llega a cinco hojas de Google, en la carpeta de Drive **"Paseíto con Dani · Sistema web"** de la cuenta paseitocondani@gmail.com:

| Hoja | Qué guarda | Correo al equipo |
|---|---|---|
| `CRM_clientes` | Un registro por cliente. Si el correo ya existe, no se repite. | "Se ha registrado un nuevo cliente" |
| `experiencia_inmersiva` | Una pestaña por destino ("Los Llanos", "Los Andes"…) con cada pago reportado. También la pestaña "Lista de espera". | "Se ha reportado un nuevo pago" |
| `tienda` | Una pestaña por producto con cada pago reportado del merch. | "Se ha reportado un nuevo pago" |
| `Club_de_aventureros` | Nombre, teléfono y correo. | "Llegó un nuevo registro al Club de Aventureros" |
| `Quiero_ser_aliado` | Nombre, marca, correo y teléfono, más casillas "Revisado" y "Condiciones enviadas". No se envía nada automático al contacto: primero se revisa quién es y luego, si se aprueba, se le envía el documento de condiciones. | "Tenemos nuevo registro en Quiero_ser_aliado. Recuerda revisar y evaluar…" |

**Al cliente:** cuando reporta un pago recibe "Recibimos el reporte de tu pago".

**Estatus de cada pago** (columna con desplegable en la pestaña de la experiencia o del producto):
- **Pendiente:** recién reportado, sin verificar.
- **Abono verificado:** una reserva o cuota ya revisada en el banco. No envía correo.
- **Pagado:** márcalo solo en el pago con el que el cliente completa el 100%. En ese momento recibe automáticamente: "Es un gusto para nosotros confirmar que hemos recibido tu pago. Prepárate, que nos vamos de Paseíto con Dani." Se envía una sola vez.

### Puesta en marcha (una sola vez)
1. Entra a **script.google.com** con paseitocondani@gmail.com → **Nuevo proyecto** → nómbralo "Paseíto con Dani · Sistema web".
2. Borra lo que trae, pega todo el archivo `apps-script/Code.gs` y guarda.
3. En el menú de funciones elige **configurar** → **Ejecutar** → acepta los permisos (Google advertirá que la app no está verificada: *Configuración avanzada → Ir al proyecto*). Se crean la carpeta y las 5 hojas, y se activan los correos de "Pagado".
4. **Implementar → Nueva implementación** → tipo **Aplicación web** · Ejecutar como: **Yo** · Quién tiene acceso: **Cualquier usuario** → Implementar. Copia la URL (termina en `/exec`).
5. Pégala en `assets/js/config.js` → `endpoint: "https://script.google.com/macros/s/…/exec"` y sube el sitio.
6. Prueba: ejecuta **probarSistema** (crea registros de prueba y te llegan los correos) o llena los formularios del sitio. Luego borra las filas de prueba.

### Antes de activar la venta
- Completa los **datos de cobro** de Paseíto con Dani en `assets/js/config.js` → `pagos.metodos` (Pago móvil, Transferencia y Zelle). Mientras digan `____`, no publiques la venta.
- Para un **destino nuevo**, agrégalo en `experiencias` (fechas, tarifas, ficha). Su pestaña se crea sola con el primer pago. Cuando pasa su `fechaFin`, desaparece del sitio.
- Para vender un **producto** de la tienda, ponle `precioUSD` en `productos`: aparece el botón "Comprar" y su pestaña se crea sola en la hoja `tienda`.
- Si cambias el código de Apps Script, publica una **nueva versión** (Implementar → Administrar implementaciones → editar → Nueva versión) para que la URL siga siendo la misma.
