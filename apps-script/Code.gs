/**
 * Paseíto con Dani · Receptor de formularios del sitio (Google Apps Script)
 * Fase 1: registro a experiencias + aliados. La hoja "Pedidos" queda lista para la Fase 2.
 *
 * INSTALACIÓN (con la cuenta técnica web@ del Workspace de Dani):
 * 1. Crea una hoja de cálculo "Paseíto con Dani · Web".
 * 2. Extensiones → Apps Script → pega este archivo.
 * 3. Implementar → Nueva implementación → Aplicación web
 *    · Ejecutar como: Yo   · Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL y pégala en assets/js/config.js → endpoints.registro y endpoints.aliados.
 */
const HOJAS = { registro: 'Registros experiencias', aliados: 'Aliados', pedidos: 'Pedidos' };
const CORREO_EQUIPO = 'danicgonz@gmail.com'; // cambiar al correo de Workspace cuando exista
const ASUNTOS = { registro: 'Nueva pre-reserva de experiencia', aliados: 'Nueva marca interesada en ser aliada', pedidos: 'Nuevo pago reportado: verificar' };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // ordena envíos simultáneos (cupos y pedidos)
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    const nombreHoja = HOJAS[d.tipo];
    if (!nombreHoja) return salida({ ok: false, error: 'tipo no válido' });
    // Limpieza básica: texto plano y longitud máxima
    Object.keys(d).forEach(k => d[k] = String(d[k] ?? '').replace(/[\u0000-\u001f]/g, ' ').slice(0, 1000));
    if (d.tipo === 'pedidos') d.estatus = 'Por verificar';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName(nombreHoja) || ss.insertSheet(nombreHoja);
    const encabezados = hoja.getLastRow() ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0] : [];
    Object.keys(d).forEach(c => { if (!encabezados.includes(c)) encabezados.push(c); });
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
    hoja.appendRow(encabezados.map(c => d[c] ?? ''));

    const cuerpo = Object.keys(d).map(k => `${k}: ${d[k]}`).join('\n');
    MailApp.sendEmail({ to: CORREO_EQUIPO, subject: `[Paseíto con Dani] ${ASUNTOS[d.tipo]}`, body: cuerpo + `\n\nHoja: ${ss.getUrl()}` });
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function salida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
