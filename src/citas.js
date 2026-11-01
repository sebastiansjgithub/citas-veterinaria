const express = require('express');
const pool = require('./db');
const { verificarToken, permitirRoles } = require('./middleware');

const router = express.Router();
router.use(verificarToken);

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

function errorDeFecha(error) {
  return error.code === '22007' || error.code === '22008';
}

router.get('/citas/disponibilidad', async (req, res) => {
  const { fecha } = req.query;
  if (!fecha || !FORMATO_FECHA.test(fecha)) {
    return res.status(400).json({ error: 'Indique una fecha válida (AAAA-MM-DD)' });
  }
  try {
    const r = await pool.query(
      `SELECT to_char(hora, 'HH24:MI') AS hora FROM citas
       WHERE fecha = $1 AND estado <> 'cancelada'`,
      [fecha]
    );
    const ocupados = r.rows.map((fila) => fila.hora);
    const libres = HORARIOS.filter((h) => !ocupados.includes(h));
    res.json({ fecha, libres, ocupados });
  } catch (error) {
    if (errorDeFecha(error)) return res.status(400).json({ error: 'La fecha no es válida' });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/citas', async (req, res) => {
  const { fecha } = req.query;
  if (!fecha || !FORMATO_FECHA.test(fecha)) {
    return res.status(400).json({ error: 'Indique una fecha válida (AAAA-MM-DD)' });
  }
  try {
    const r = await pool.query(
      `SELECT c.id, to_char(c.hora, 'HH24:MI') AS hora, c.motivo, c.estado,
              m.nombre AS mascota, t.nombre AS tutor
       FROM citas c
       JOIN mascotas m ON m.id = c.mascota_id
       JOIN tutores t ON t.id = m.tutor_id
       WHERE c.fecha = $1
       ORDER BY c.hora`,
      [fecha]
    );
    res.json(r.rows);
  } catch (error) {
    if (errorDeFecha(error)) return res.status(400).json({ error: 'La fecha no es válida' });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/citas', permitirRoles('recepcion', 'administrador'), async (req, res) => {
  const { mascota_id, fecha, hora, motivo } = req.body;
  if (!mascota_id) {
    return res.status(400).json({ error: 'Seleccione una mascota' });
  }
  if (!fecha || !FORMATO_FECHA.test(fecha)) {
    return res.status(400).json({ error: 'Indique una fecha válida (AAAA-MM-DD)' });
  }
  if (!HORARIOS.includes(hora)) {
    return res.status(400).json({ error: 'Seleccione un horario de atención válido' });
  }
  try {
    const pasada = await pool.query('SELECT $1::date < CURRENT_DATE AS pasada', [fecha]);
    if (pasada.rows[0].pasada) {
      return res.status(400).json({ error: 'No se puede agendar en una fecha pasada' });
    }
    const r = await pool.query(
      `INSERT INTO citas (mascota_id, fecha, hora, motivo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, to_char(hora, 'HH24:MI') AS hora`,
      [mascota_id, fecha, hora, motivo || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese horario ya está ocupado' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'La mascota seleccionada no existe' });
    }
    if (errorDeFecha(error)) return res.status(400).json({ error: 'La fecha no es válida' });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.patch('/citas/:id/cancelar', permitirRoles('recepcion', 'administrador'), async (req, res) => {
  try {
    const r = await pool.query(
      `UPDATE citas SET estado = 'cancelada'
       WHERE id = $1 AND estado = 'programada' RETURNING id`,
      [req.params.id]
    );
    if (r.rowCount === 0) {
      return res.status(404).json({ error: 'La cita no existe o ya no está programada' });
    }
    res.json({ id: r.rows[0].id, estado: 'cancelada' });
  } catch (error) {
    res.status(400).json({ error: 'Identificador de cita no válido' });
  }
});

module.exports = router;
