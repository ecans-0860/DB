// script.js
// Utilidades para cargar la base SQLite en el cliente usando sql.js
let _dbPromise = null;


function initDb() {
if (_dbPromise) return _dbPromise;
_dbPromise = (async () => {
const SQL = await initSqlJs({
locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
});
const resp = await fetch('https://ecans-0860.github.io/DB/Proyecto1.db');
if(resp.ok) console.log('DB Cargada Correctamente')
if (!resp.ok) throw new Error('No se pudo cargar la base de datos');
const buf = await resp.arrayBuffer();
const db = new SQL.Database(new Uint8Array(buf));
console.log(db)

return db;
})();
return _dbPromise;
}

async function showTable() {
  const db = await initDb();
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
   
    if (tables.length > 0) {
      const tableNames = tables[0].values.map(row => row[0]);
      console.log("Nombres de tablas:", tableNames);
    }

  // Ejecutamos la consulta"

  const res = db.exec(`SELECT COUNT(*) as total FROM "Calendario";`);
console.log(res);

  if (res.length === 0) {
    console.log("⚠️ La tabla está vacía o no existe");
    return;
  }

  // Extraer columnas y valores
  const columns = res[0].columns;
  const values = res[0].values;

  // Construir tabla HTML
  let html = "<table border='1' cellspacing='0' cellpadding='5'>";
  html += "<tr>" + columns.map(col => `<th>${col}</th>`).join("") + "</tr>";
  values.forEach(row => {
    html += "<tr>" + row.map(val => `<td>${val}</td>`).join("") + "</tr>";
  });
  html += "</table>";

  // Insertar en el HTML
  document.getElementById("output").innerHTML = html;
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