// script.js
// Utilidades para cargar la base SQLite en el cliente usando sql.js
let _dbPromise = null;


function initDb() {
if (_dbPromise) return _dbPromise;
_dbPromise = (async () => {
const SQL = await initSqlJs({
locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
});
const resp = await fetch('../DB/Proyecto1.db');
if (!resp.ok) throw new Error('No se pudo cargar residencial.db');
const buf = await resp.arrayBuffer();
const db = new SQL.Database(new Uint8Array(buf));
return db;
})();
return _dbPromise;
}


// Helpers de fecha
function getCurrentMonthYear() {
const now = new Date();
return { mes: now.getMonth() + 1, anio: now.getFullYear() };
}


function pad2(n){ return n < 10 ? `0${n}` : `${n}`; }


// Renderiza mensajes
function showMessage(elId, text, type = 'info') {
const el = document.getElementById(elId);
if (!el) return;
el.textContent = text;
el.className = `msg ${type}`; // clases en CSS
}


// Escapa HTML mínimo
function esc(str){
return String(str)
.replaceAll('&','&amp;')
.replaceAll('<','&lt;')
.replaceAll('>','&gt;');
}