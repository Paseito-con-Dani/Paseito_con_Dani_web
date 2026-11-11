/**
 * Paseíto con Dani · Sistema web (Google Apps Script independiente)
 * ------------------------------------------------------------------
 * Recibe los formularios de paseitocondani.com y los guarda en Google Sheets:
 *
 *   CRM_clientes          → un registro por cliente (no repite correos)
 *   experiencia_inmersiva → una pestaña por destino ("Los Llanos", "Los Andes"…) con cada pago reportado
 *   tienda                → una pestaña por producto con cada pago reportado (merch)
 *   Club_de_aventureros   → interesados en el Club / Pasaporte PCD
 *   Quiero_ser_aliado     → marcas que quieren ser aliadas
 *
 * Correos automáticos
 *   · Al equipo: "Se ha registrado un nuevo cliente", "Se ha reportado un nuevo pago",
 *     "Llegó un nuevo registro al Club de Aventureros", "Tenemos nuevo registro en Quiero_ser_aliado".
 *   · Al cliente, al reportar: "Recibimos el reporte de tu pago" (con el detalle de la experiencia).
 *   · Al cliente, cuando cambias la columna "Estatus" a "Pagado" (solo en el pago que completa el 100%):
 *     "Es un gusto para nosotros confirmar que hemos recibido tu pago. / Prepárate, que nos vamos de Paseíto con Dani."
 *     Las reservas y cuotas revisadas se marcan "Abono verificado" y no envían correo.
 *
 * PUESTA EN MARCHA (con la cuenta paseitocondani@gmail.com) — ver también README.md
 *   1. script.google.com → Nuevo proyecto → nómbralo "Paseíto con Dani · Sistema web".
 *   2. Borra el contenido, pega este archivo y guarda.
 *   3. Elige la función "configurar" → Ejecutar → acepta los permisos.
 *      Crea la carpeta "Paseíto con Dani · Sistema web" en Drive con las 5 hojas y activa los correos de "Pagado".
 *      En Ver → Registros de ejecución verás los enlaces de cada hoja.
 *   4. Implementar → Nueva implementación → Aplicación web · Ejecutar como: Yo · Acceso: Cualquier usuario.
 *   5. Copia la URL (termina en /exec) y pégala en assets/js/config.js → endpoint.
 *   6. Opcional: ejecuta "probarSistema" para crear registros de prueba y recibir los correos.
 *
 * Límite: una cuenta de Gmail gratuita envía unos 100 correos automáticos al día.
 */

const CORREO_EQUIPO = 'paseitocondani@gmail.com';
const MARCA = 'Paseíto con Dani';
const CARPETA = 'Paseíto con Dani · Sistema web';

const LIBROS = {
  crm:      { nombre: 'CRM_clientes',          pestana: 'Clientes',
              columnas: ['Fecha de registro', 'Nombre y apellido', 'Correo', 'WhatsApp', 'Origen', 'Primera compra o experiencia'] },
  exp:      { nombre: 'experiencia_inmersiva', pestana: null },
  tienda:   { nombre: 'tienda',                pestana: null },
  club:     { nombre: 'Club_de_aventureros',   pestana: 'Registros',
              columnas: ['Fecha', 'Nombre', 'Teléfono', 'Correo'] },
  aliados:  { nombre: 'Quiero_ser_aliado',     pestana: 'Registros',
              columnas: ['Fecha', 'Nombre', 'Marca o empresa', 'Correo', 'Teléfono / WhatsApp', 'Revisado', 'Condiciones enviadas'] }
};

const COLUMNAS_PAGO = [
  'Fecha del reporte', 'Nombre y apellido', 'Correo', 'WhatsApp', 'Adultos', 'Niños', 'Cantidad',
  'Método de pago', 'Banco de procedencia', 'Teléfono emisor', 'Cuenta', 'Cédula', 'Titular', 'Correo Zelle',
  'Corresponde a', 'Fecha de la operación', 'Referencia', 'Monto pagado', 'Moneda', 'Total estimado (USD)',
  'Estatus', 'Confirmación enviada'
];
// Pendiente: recién reportado · Abono verificado: reserva o cuota revisada (sin correo)
// Pagado: márcalo SOLO en el pago que completa el 100% → se envía la confirmación al cliente
const ESTATUS = ['Pendiente', 'Abono verificado', 'Pagado'];
const COLUMNAS_ESPERA = ['Fecha', 'Destino', 'Nombre', 'Correo', 'WhatsApp', 'Personas', 'Mascota', 'Mensaje'];

/* =================== Recepción de formularios =================== */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = limpiar(JSON.parse((e && e.postData && e.postData.contents) || '{}'));
    switch (d.tipo) {
      case 'pago':     return salida(registrarPago(d));
      case 'club':     return salida(registrarClub(d));
      case 'aliados':  return salida(registrarAliado(d));
      case 'registro': return salida(registrarListaEspera(d));
      default:         return salida({ ok: false, error: 'tipo no válido' });
    }
  } catch (err) {
    console.error(err);
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
function doGet() { return salida({ ok: true, sistema: MARCA }); }

/* 1 · CRM: un registro por cliente (el correo es la llave) */
function registrarCliente(d, origen, primera) {
  const hoja = hojaDe('crm', LIBROS.crm.pestana, LIBROS.crm.columnas);
  const correo = String(d.correo || '').trim().toLowerCase();
  if (!correo) return false;
  const n = hoja.getLastRow();
  if (n > 1) {
    const correos = hoja.getRange(2, 3, n - 1, 1).getValues().map(r => String(r[0]).trim().toLowerCase());
    if (correos.includes(correo)) return false; // ya existe: no se registra de nuevo
  }
  hoja.appendRow([new Date(), d.nombre, correo, d.telefono, origen, primera]);
  avisarEquipo('Se ha registrado un nuevo cliente',
    `Se ha registrado un nuevo cliente.\n\nNombre: ${d.nombre}\nCorreo: ${correo}\nWhatsApp: ${d.telefono}\nOrigen: ${origen} · ${primera}`, 'crm');
  return true;
}

/* 2 · Pagos de experiencias (pestaña por destino) y de la tienda (pestaña por producto) */
function registrarPago(d) {
  const esTienda = d.categoria === 'tienda';
  const libro = esTienda ? 'tienda' : 'exp';
  const pestana = nombrePestana(d.destino || d.experiencia || (esTienda ? 'Pedidos' : 'Experiencia'));
  registrarCliente(d, esTienda ? 'Tienda' : 'Experiencia inmersiva', d.destino || d.experiencia || '');
  const hoja = hojaDe(libro, pestana, COLUMNAS_PAGO, true);
  hoja.appendRow([
    new Date(), d.nombre, String(d.correo || '').toLowerCase(), d.telefono,
    num(d.adultos), num(d.ninos), num(d.cantidad),
    d.metodo, d.banco, d.telefonoEmisor, d.cuenta, d.cedula, d.titular, d.correoZelle,
    d.tipoPago, d.fechaOperacion, d.referencia, num(d.monto), d.moneda, num(d.totalUSD),
    'Pendiente', ''
  ]);
  // Guardamos el detalle para reutilizarlo en el correo de confirmación
  PropertiesService.getScriptProperties().setProperty(`detalle:${libro}:${pestana}`, (d.detalle || '').slice(0, 8000));

  avisarEquipo('Se ha reportado un nuevo pago',
    `Se ha reportado un nuevo pago (${esTienda ? 'tienda' : 'experiencia inmersiva'} · ${pestana}).\n\n` +
    `Cliente: ${d.nombre} · ${d.correo} · ${d.telefono}\nMétodo: ${d.metodo} · Banco: ${d.banco}\n` +
    `Corresponde a: ${d.tipoPago}\nFecha de la operación: ${d.fechaOperacion} · Referencia: ${d.referencia}\n` +
    `Monto: ${d.monto} ${d.moneda}\n\nVerifica el pago en el banco y cambia su Estatus en la hoja:\n· "Abono verificado" si es una reserva o cuota (no se envía correo).\n· "Pagado" si con este pago el cliente completa el 100% (se le envía la confirmación).`, libro);

  if (d.correo) {
    MailApp.sendEmail({
      to: d.correo, name: MARCA, replyTo: CORREO_EQUIPO,
      subject: `${MARCA} · Recibimos el reporte de tu pago`,
      body: `¡Hola, ${d.nombre}!\n\nRecibimos el reporte de tu pago para ${esTienda ? 'tu compra: ' : 'la Experiencia 360° '}${pestana}. ` +
            `Lo estamos verificando y te escribiremos en cuanto lo confirmemos.\n\n` +
            `Resumen\n· Corresponde a: ${d.tipoPago}\n· Método: ${d.metodo}\n· Monto: ${d.monto} ${d.moneda} · Referencia: ${d.referencia}\n` +
            (esTienda ? `· Cantidad: ${d.cantidad}\n` : `· Viajeros: ${d.adultos} adulto(s), ${d.ninos} niño(s)\n`) +
            (d.detalle ? `\n${d.detalle}\n` : '') + `\n${MARCA}`
    });
  }
  return { ok: true };
}

/* 3 · Club de Aventureros */
function registrarClub(d) {
  const hoja = hojaDe('club', LIBROS.club.pestana, LIBROS.club.columnas);
  hoja.appendRow([new Date(), d.nombre, d.telefono, String(d.correo || '').toLowerCase()]);
  avisarEquipo('Llegó un nuevo registro al Club de Aventureros',
    `Llegó un nuevo registro al Club de Aventureros.\n\nNombre: ${d.nombre}\nTeléfono: ${d.telefono}\nCorreo: ${d.correo}`, 'club');
  return { ok: true };
}

/* 4 · Quiero ser aliado */
function registrarAliado(d) {
  const hoja = hojaDe('aliados', LIBROS.aliados.pestana, LIBROS.aliados.columnas);
  hoja.appendRow([new Date(), d.nombre, d.marca, String(d.correo || '').toLowerCase(), d.telefono, false, false]);
  const fila = hoja.getLastRow();
  hoja.getRange(fila, 6, 1, 2).insertCheckboxes();
  avisarEquipo('Tenemos nuevo registro en Quiero_ser_aliado',
    `Tenemos nuevo registro en Quiero_ser_aliado.\n\nNombre: ${d.nombre}\nMarca o empresa: ${d.marca}\nCorreo: ${d.correo}\nTeléfono / WhatsApp: ${d.telefono}\n\n` +
    `Recuerda revisar y evaluar para aprobar el envío del documento de condiciones de alianza.`, 'aliados');
  return { ok: true };
}

/* Lista de espera de experiencias aún no abiertas */
function registrarListaEspera(d) {
  const hoja = hojaDe('exp', 'Lista de espera', COLUMNAS_ESPERA);
  hoja.appendRow([new Date(), d.experiencia || d.destino || '', d.nombre, String(d.correo || '').toLowerCase(), d.telefono, d.personas, d.mascota, d.mensaje]);
  avisarEquipo('Nuevo registro en la lista de espera', `Destino: ${d.experiencia || ''}\nNombre: ${d.nombre}\nCorreo: ${d.correo}\nWhatsApp: ${d.telefono}`, 'exp');
  return { ok: true };
}

/* =================== Confirmación de pago =================== */
/* Activador instalable "al editar" en experiencia_inmersiva y tienda (lo crea configurar()). */
function alEditar(e) {
  if (!e || !e.range) return;
  const hoja = e.range.getSheet();
  if (e.range.getRow() < 2 || hoja.getName() === 'Lista de espera') return;
  const cols = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const cEst = cols.indexOf('Estatus') + 1, cConf = cols.indexOf('Confirmación enviada') + 1;
  if (!cEst || e.range.getColumn() !== cEst) return;
  for (let r = e.range.getRow(); r < e.range.getRow() + e.range.getNumRows(); r++) {
    const fila = hoja.getRange(r, 1, 1, cols.length).getValues()[0];
    if (fila[cEst - 1] !== 'Pagado' || fila[cConf - 1]) continue;
    const nombre = fila[cols.indexOf('Nombre y apellido')], correo = fila[cols.indexOf('Correo')];
    if (!correo) continue;
    const libro = e.source.getId() === idLibro('tienda') ? 'tienda' : 'exp';
    const detalle = PropertiesService.getScriptProperties().getProperty(`detalle:${libro}:${hoja.getName()}`) || '';
    MailApp.sendEmail({
      to: correo, name: MARCA, replyTo: CORREO_EQUIPO,
      subject: `${MARCA} · ¡Pago completo confirmado!`,
      body: `¡Hola, ${nombre}!\n\nEs un gusto para nosotros confirmar que hemos recibido tu pago.\n\nPrepárate, que nos vamos de Paseíto con Dani.\n\n` +
            `${libro === 'tienda' ? 'Compra' : 'Experiencia'}: ${hoja.getName()}\nMonto: ${fila[cols.indexOf('Monto pagado')]} ${fila[cols.indexOf('Moneda')]} · Corresponde a: ${fila[cols.indexOf('Corresponde a')]}\n` +
            (detalle ? `\n${detalle}\n` : '') + `\n${MARCA}`
    });
    hoja.getRange(r, cConf).setValue(new Date());
  }
}

/* =================== Configuración (ejecutar una vez) =================== */
function configurar() {
  const carpeta = obtenerCarpeta();
  Object.keys(LIBROS).forEach(k => {
    const libro = abrirLibro(k, carpeta);
    const L = LIBROS[k];
    if (L.pestana) hojaDe(k, L.pestana, L.columnas);
    console.log(`${L.nombre}: ${libro.getUrl()}`);
  });
  // Pestañas de pago de las experiencias que ya están a la venta
  hojaDe('exp', 'Los Llanos', COLUMNAS_PAGO, true);
  hojaDe('exp', 'Lista de espera', COLUMNAS_ESPERA);
  // Activadores para el correo de "Pagado"
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'alEditar').forEach(t => ScriptApp.deleteTrigger(t));
  ['exp', 'tienda'].forEach(k => ScriptApp.newTrigger('alEditar').forSpreadsheet(idLibro(k)).onEdit().create());
  limpiarHojasVacias();
  console.log('Listo. Ahora: Implementar → Nueva implementación → Aplicación web.');
}

/* Crea un registro de prueba de cada tipo (usa tu propio correo para ver los mensajes). */
function probarSistema() {
  const yo = CORREO_EQUIPO;
  registrarPago(limpiar({ tipo: 'pago', categoria: 'experiencia', destino: 'Los Llanos', experiencia: 'Los Llanos (prueba)', nombre: 'Cliente de prueba', correo: yo, telefono: '0412-0000000',
    adultos: 2, ninos: 1, metodo: 'Pago móvil', banco: 'Banco de prueba', telefonoEmisor: '0412-0000000', cedula: 'V-00000000', titular: 'Cliente de prueba',
    tipoPago: 'Reserva (30%)', fechaOperacion: '2026-11-12', referencia: '000000', monto: 100, moneda: 'Bs', totalUSD: 1955, detalle: 'Registro de prueba.' }));
  registrarClub({ nombre: 'Prueba Club', telefono: '0412-0000000', correo: yo });
  registrarAliado({ nombre: 'Prueba Aliado', marca: 'Marca de prueba', correo: yo, telefono: '0412-0000000' });
  console.log('Pruebas creadas. Revisa las hojas y tu correo; luego borra las filas de prueba.');
}

/* =================== Utilidades =================== */
function obtenerCarpeta() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('carpeta');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const it = DriveApp.getFoldersByName(CARPETA);
  const f = it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA);
  props.setProperty('carpeta', f.getId());
  return f;
}
function abrirLibro(k, carpeta) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('libro:' + k);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  const ss = SpreadsheetApp.create(LIBROS[k].nombre);
  DriveApp.getFileById(ss.getId()).moveTo(carpeta || obtenerCarpeta());
  props.setProperty('libro:' + k, ss.getId());
  return ss;
}
function idLibro(k) { return abrirLibro(k).getId(); }
function hojaDe(k, nombre, columnas, conEstatus) {
  const ss = abrirLibro(k);
  let hoja = ss.getSheetByName(nombre);
  if (!hoja) {
    hoja = ss.insertSheet(nombre);
    hoja.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight('bold').setBackground('#F2EBD8');
    hoja.setFrozenRows(1);
    if (conEstatus) {
      const c = columnas.indexOf('Estatus') + 1;
      const regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTATUS, true).setAllowInvalid(false).build();
      hoja.getRange(2, c, 2000, 1).setDataValidation(regla);
      hoja.getRange(2, c, 2000, 1).setBackground('#FFF6D2');
    }
  }
  return hoja;
}
function limpiarHojasVacias() {
  Object.keys(LIBROS).forEach(k => {
    const ss = abrirLibro(k), h = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
    if (h && ss.getSheets().length > 1 && h.getLastRow() === 0) ss.deleteSheet(h);
  });
}
function avisarEquipo(asunto, cuerpo, k) {
  let url = ''; try { url = abrirLibro(k).getUrl(); } catch (e) {}
  MailApp.sendEmail({ to: CORREO_EQUIPO, name: MARCA + ' · Web', subject: `[${MARCA}] ${asunto}`, body: cuerpo + (url ? `\n\nHoja: ${url}` : '') });
}
function nombrePestana(t) { return String(t).replace(/[\[\]\*\?\/\\:]/g, '-').trim().slice(0, 90) || 'Registros'; }
function num(v) { const n = Number(v); return v === undefined || v === '' || isNaN(n) ? (v || '') : n; }
/* Quita caracteres de control y evita que un texto se interprete como fórmula en la hoja */
function limpiar(d) {
  const o = {};
  Object.keys(d || {}).forEach(k => {
    let v = d[k]; if (v === null || v === undefined) v = '';
    v = String(v).replace(/[\u0000-\u0008\u000b-\u001f]/g, ' ').slice(0, 8000);
    if (/^[=+\-@]/.test(v) && k !== 'detalle') v = "'" + v;
    o[k] = v;
  });
  return o;
}
function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
