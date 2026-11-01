const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { correo, clave } = req.body;
  if (!correo || !clave) {
    return res.status(400).json({ error: 'Ingrese correo y clave' });
  }
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, clave_hash, rol FROM usuarios WHERE correo = $1',
      [correo]
    );
    const usuario = resultado.rows[0];
    if (!usuario || !(await bcrypt.compare(clave, usuario.clave_hash))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
