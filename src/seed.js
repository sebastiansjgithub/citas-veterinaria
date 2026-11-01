const bcrypt = require('bcryptjs');
const pool = require('./db');

const usuarios = [
  { nombre: 'Administrador Bivett', correo: 'admin@bivett.test', clave: 'Admin123*', rol: 'administrador' },
  { nombre: 'Ana Recepción', correo: 'ana@bivett.test', clave: 'Clave123*', rol: 'recepcion' },
  { nombre: 'Dr. Carlos Veterinario', correo: 'carlos@bivett.test', clave: 'Vet123*', rol: 'veterinario' }
];

async function ejecutar() {
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.clave, 10);
    await pool.query(
      `INSERT INTO usuarios (nombre, correo, clave_hash, rol)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (correo) DO NOTHING`,
      [u.nombre, u.correo, hash, u.rol]
    );
  }
  console.log('Usuarios iniciales creados');
  await pool.end();
}

ejecutar().catch((e) => {
  console.error('Error en seed:', e.message);
  process.exit(1);
});
