const fs = require('fs');
const path = require('path');
const pool = require('./db');

const archivos = ['schema.sql', 'migracion_citas.sql'];

async function ejecutar() {
  for (const archivo of archivos) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', archivo), 'utf8');
    await pool.query(sql);
    console.log('Aplicado: ' + archivo);
  }
  console.log('Migraciones aplicadas');
  await pool.end();
}

ejecutar().catch((e) => {
  console.error('Error en migrate:', e.message);
  process.exit(1);
});
