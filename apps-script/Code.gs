/**
 * Paseíto con Dani · Receptor de formularios del sitio (Google Apps Script)
 *
 * QUÉ HACE
 *  · Registros y lista de espera de experiencias  → pestaña "Registros experiencias"
 *  · Marcas interesadas en ser aliadas            → pestaña "Aliados"
 *  · Club de Aventureros (lista de interesados)   → pestaña "Club de Aventureros"
 *  · Reporte de pago de Experiencias 360°         → UNA PESTAÑA POR EXPERIENCIA (se crea sola)
 *      - Al reportar: correo al cliente "Estamos revisando tu pago" + detalle de la experiencia.
 *      - Al cambiar el "Estatus del pago" a "Pago completo": correo "Tu lugar está asegurado".
 *
 * INSTALACIÓN (con la cuenta del proyecto paseitocondani@gmail.com)
 *  1. Crea una hoja de cálculo llamada "Paseíto con Dani · Web".
 *  2. Extensiones → Apps Script → borra el contenido y pega este archivo → Guardar.
 *  3. En el menú de funciones elige "instalarActivadores" → Ejecutar → acepta los permisos.
 *     (Esto activa el correo automático cuando cambias un estatus a "Pago completo".)
 *  4. Implementar → Nueva implementación → Tipo: Aplicación web
 *       · Ejecutar como: Yo   · Quién tiene acceso: Cualquier usuario
 *  5. Copia la URL y pégala en assets/js/config.js → endpoints (registro, aliados, pago, club).
 *
 * LÍMITE: una cuenta de Gmail gratuita envía unos 100 correos automáticos al día.
 */

const CORREO_EQUIPO = 'paseitocondani@gmail.com';
const MARCA = 'Paseíto con Dani';
const HOJAS = { registro: 'Registros experiencias', aliados: 'Aliados', club: 'Club de Aventureros', pedidos: 'Pedidos' };
const ESTATUS = ['En revisión', 'Abono confirmado', 'Pago completo', 'Rechazado'];
const COLUMNAS_PAGO = [
  'Fecha del reporte', 'Nombre', 'Correo', 'Teléfono', 'Adultos', 'Niños', 'Método', 'Banco de procedencia',
  'Fecha de la operación', 'Referencia', 'Monto', 'Moneda', 'Corresponde a', 'Estatus del pago', 'Confirmación enviada'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    Object.keys(d).forEach(k => d[k] = String(d[k] ?? '').replace(/[\u0000-\u0008\u000b-\u001f]/g, ' ').slice(0, 4000));
    if (d.tipo === 'pago') return salida(registrarPago(d));
    const nombreHoja = HOJAS[d.tipo];
    if (!nombreHoja) return salida({ ok: false, error: 'tipo no válido' });
    agregarFila(nombreHoja, d);
    MailApp.sendEmail({ to: CORREO_EQUIPO, subject: `[${MARCA}] Nuevo registro: ${nombreHoja}`, body: texto(d) });
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Pagos de Experiencias 360° ---------- */
function registrarPago(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nombre = ('Exp · ' + (d.hoja || d.experiencia || 'Experiencia')).replace(/[\[\]\*\?\/\\:]/g, '-').slice(0, 95);
  let hoja = ss.getSheetByName(nombre);
  if (!hoja) {
    hoja = ss.insertSheet(nombre);
    hoja.getRange(1, 1, 1, COLUMNAS_PAGO.length).setValues([COLUMNAS_PAGO]).setFontWeight('bold').setBackground('#F2EBD8');
    hoja.setFrozenRows(1);
    const col = COLUMNAS_PAGO.indexOf('Estatus del pago') + 1;
    const regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTATUS, true).build();
    hoja.getRange(2, col, 1000, 1).setDataValidation(regla);
  }
  hoja.appendRow([
    new Date(), d.nombre, d.correo, d.telefono, Number(d.adultos) || 0, Number(d.ninos) || 0, d.metodo, d.banco,
    d.fechaOperacion, d.referencia, Number(d.monto) || d.monto, d.moneda, d.tipoPago, 'En revisión', ''
  ]);

  // Guardamos el detalle de la experiencia para reutilizarlo en el correo de confirmación
  PropertiesService.getScriptProperties().setProperty('detalle:' + nombre, d.detalle || '');

  if (d.correo) {
    MailApp.sendEmail({
      to: d.correo, name: MARCA, replyTo: CORREO_EQUIPO,
      subject: `${MARCA} · Estamos revisando tu pago`,
      body: `¡Hola, ${d.nombre}!\n\nRecibimos el reporte de tu pago para la ${d.experiencia}. Se está revisando tu pago y te escribiremos en cuanto lo confirmemos.\n\n` +
            `Resumen de tu reporte\n· Corresponde a: ${d.tipoPago}\n· Método: ${d.metodo} · Banco: ${d.banco}\n· Monto: ${d.monto} ${d.moneda} · Referencia: ${d.referencia}\n· Viajeros: ${d.adultos} adulto(s), ${d.ninos} niño(s)\n\n` +
            `Detalle de tu Experiencia 360°\n${d.detalle || ''}\n\n¡Nos vamos de Paseíto con Dani!\n${MARCA}`
    });
  }
  MailApp.sendEmail({ to: CORREO_EQUIPO, subject: `[${MARCA}] Pago reportado: verificar (${d.experiencia})`, body: texto(d) + `\n\nHoja: ${ss.getUrl()}` });
  return { ok: true };
}

/* Se ejecuta cuando alguien edita la hoja (activador instalable). */
function alEditar(e) {
  const hoja = e.range.getSheet();
  if (!hoja.getName().startsWith('Exp · ') || e.range.getRow() < 2) return;
  const cols = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const cEstatus = cols.indexOf('Estatus del pago') + 1, cEnviado = cols.indexOf('Confirmación enviada') + 1;
  if (e.range.getColumn() !== cEstatus || String(e.value) !== 'Pago completo') return;
  const fila = hoja.getRange(e.range.getRow(), 1, 1, cols.length).getValues()[0];
  if (fila[cEnviado - 1]) return; // ya se envió antes
  const nombre = fila[cols.indexOf('Nombre')], correo = fila[cols.indexOf('Correo')];
  if (!correo) return;
  const experiencia = hoja.getName().replace('Exp · ', '');
  const detalle = PropertiesService.getScriptProperties().getProperty('detalle:' + hoja.getName()) || '';
  MailApp.sendEmail({
    to: correo, name: MARCA, replyTo: CORREO_EQUIPO,
    subject: `${MARCA} · ¡Pago completo! Tu lugar está asegurado`,
    body: `¡Hola, ${nombre}!\n\nConfirmamos que recibimos tu pago completo para la Experiencia 360° ${experiencia}. Tu spot está asegurado. 🎉\n\n` +
          `Muy pronto te escribiremos con la logística del viaje.\n\n${detalle}\n\n¡Nos vamos de Paseíto con Dani!\n${MARCA}`
  });
  hoja.getRange(e.range.getRow(), cEnviado).setValue(new Date());
}

/* Ejecutar UNA vez desde el editor para activar los correos de confirmación. */
function instalarActivadores() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'alEditar').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('alEditar').forSpreadsheet(ss).onEdit().create();
}

/* ---------- Utilidades ---------- */
function agregarFila(nombreHoja, d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(nombreHoja) || ss.insertSheet(nombreHoja);
  const datos = Object.assign({}, d); delete datos.detalle;
  const encabezados = hoja.getLastRow() ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0] : [];
  Object.keys(datos).forEach(c => { if (!encabezados.includes(c)) encabezados.push(c); });
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
  hoja.appendRow(encabezados.map(c => datos[c] ?? ''));
}
function texto(d) { return Object.keys(d).filter(k => k !== 'detalle').map(k => `${k}: ${d[k]}`).join('\n'); }
function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
