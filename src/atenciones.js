const express = require('express');
const pool = require('./db');
const { verificarToken, permitirRoles } = require('./middleware');

const router = express.Router();
router.use(verificarToken);

router.post('/atenciones', permitirRoles('veterinario'), async (req, res) => {
  const { mascota_id, diagnostico, tratamiento } = req.body;
  if (!mascota_id) {
    return res.status(400).json({ error: 'Seleccione una mascota' });
  }
  if (!diagnostico || !diagnostico.trim()) {
    return res.status(400).json({ error: 'El diagnóstico es obligatorio' });
  }
  try {
    const r = await pool.query(
      `INSERT INTO atenciones (mascota_id, veterinario_id, diagnostico, tratamiento)
       VALUES ($1, $2, $3, $4)
       RETURNING id, to_char(fecha, 'YYYY-MM-DD HH24:MI') AS fecha`,
      [mascota_id, req.usuario.id, diagnostico.trim(), (tratamiento || '').trim() || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: 'La mascota seleccionada no existe' });
    }
    if (error.code === '22P02') {
      return res.status(400).json({ error: 'Identificador de mascota no válido' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/mascotas/:id/atenciones', permitirRoles('veterinario', 'administrador'), async (req, res) => {
  try {
    const mascota = await pool.query('SELECT id FROM mascotas WHERE id = $1', [req.params.id]);
    if (mascota.rowCount === 0) {
      return res.status(404).json({ error: 'La mascota no existe' });
    }
    const r = await pool.query(
      `SELECT a.id, to_char(a.fecha, 'YYYY-MM-DD HH24:MI') AS fecha,
              a.diagnostico, a.tratamiento, u.nombre AS veterinario
       FROM atenciones a JOIN usuarios u ON u.id = a.veterinario_id
       WHERE a.mascota_id = $1
       ORDER BY a.fecha DESC, a.id DESC`,
      [req.params.id]
    );
    res.json(r.rows);
  } catch (error) {
    if (error.code === '22P02') {
      return res.status(400).json({ error: 'Identificador de mascota no válido' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
