const express = require('express');
const pool = require('./db');
const { verificarToken, permitirRoles } = require('./middleware');

const router = express.Router();
router.use(verificarToken);

router.get('/tutores', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, nombre, telefono, correo FROM tutores ORDER BY nombre'
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/tutores', permitirRoles('recepcion', 'administrador'), async (req, res) => {
  const { nombre, telefono, correo } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre del tutor es obligatorio' });
  }
  try {
    const r = await pool.query(
      'INSERT INTO tutores (nombre, telefono, correo) VALUES ($1, $2, $3) RETURNING id, nombre',
      [nombre.trim(), telefono || null, correo || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/mascotas', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT m.id, m.nombre, m.especie, m.raza,
              to_char(m.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
              t.nombre AS tutor
       FROM mascotas m JOIN tutores t ON t.id = m.tutor_id
       ORDER BY m.id DESC`
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/mascotas', permitirRoles('recepcion', 'administrador'), async (req, res) => {
  const { nombre, especie, raza, fecha_nacimiento, tutor_id } = req.body;
  if (!nombre || !nombre.trim() || !especie || !especie.trim()) {
    return res.status(400).json({ error: 'Nombre y especie son obligatorios' });
  }
  if (!tutor_id) {
    return res.status(400).json({ error: 'Debe asociar la mascota a un tutor' });
  }
  try {
    const r = await pool.query(
      `INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, tutor_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre`,
      [nombre.trim(), especie.trim(), raza || null, fecha_nacimiento || null, tutor_id]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: 'El tutor seleccionado no existe' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
