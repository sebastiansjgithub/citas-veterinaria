require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');
const auth = require('./auth');
const pacientes = require('./pacientes');
const citas = require('./citas');
const atenciones = require('./atenciones');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', auth);
app.use('/api', pacientes);
app.use('/api', citas);
app.use('/api', atenciones);

app.get('/', (req, res) => res.redirect('/login.html'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', baseDeDatos: 'conectada' });
  } catch (error) {
    res.status(500).json({ status: 'error', baseDeDatos: 'sin conexión' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
