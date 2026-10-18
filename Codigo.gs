/**
 * Receptor de datos para la prueba de igualación a la muestra de segundo orden.
 * Pegar en Extensiones > Apps Script de una hoja de cálculo de Google.
 *
 * Crea y mantiene dos hojas:
 *   - "Ensayos":  un renglón por ensayo
 *   - "Sesiones": un renglón por sesión, con aciertos y TR medio por prueba
 * Cada envío reemplaza los renglones anteriores de la misma sesión, así que
 * reenviar nunca duplica datos.
 */

var COL_SESION = 2; // posición (desde 0) de la columna "sesion" en ambas hojas

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    var d = JSON.parse(e.postData.contents);
    if (!d.sid || !d.csvEnsayos || !d.csvResumen) throw new Error('Datos incompletos');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    upsert_(ss, 'Ensayos', Utilities.parseCsv(d.csvEnsayos), d.sid);
    upsert_(ss, 'Sesiones', Utilities.parseCsv(d.csvResumen), d.sid);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Sirve para comprobar en el navegador que la implementación está activa.
function doGet() {
  return json_({ ok: true, mensaje: 'El receptor está activo' });
}

function upsert_(ss, nombre, tabla, sid) {
  var sh = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  var cab = tabla[0];
  var filas = tabla.slice(1).map(function (r) {
    return r.map(function (v, i) {
      return i !== COL_SESION && v !== '' && !isNaN(v) ? Number(v) : v;
    });
  });
  if (sh.getLastRow() === 0) {
    sh.appendRow(cab);
    sh.setFrozenRows(1);
  }
  // Borra los renglones previos de esta sesión (de abajo hacia arriba, por bloques).
  var ultima = sh.getLastRow();
  if (ultima > 1) {
    var col = sh.getRange(2, COL_SESION + 1, ultima - 1, 1).getValues();
    var fin = -1;
    for (var i = col.length - 1; i >= -1; i--) {
      var coincide = i >= 0 && String(col[i][0]) === String(sid);
      if (coincide && fin === -1) fin = i;
      if (!coincide && fin !== -1) {
        sh.deleteRows(i + 3, fin - i); // i+1 es el primero del bloque; +2 por el encabezado
        fin = -1;
      }
    }
  }
  if (filas.length) {
    sh.getRange(sh.getLastRow() + 1, 1, filas.length, cab.length).setValues(filas);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
