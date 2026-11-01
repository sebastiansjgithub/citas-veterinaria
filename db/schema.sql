CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) UNIQUE NOT NULL,
  clave_hash VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador','recepcion','veterinario'))
);

CREATE TABLE IF NOT EXISTS tutores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  correo VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS mascotas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  especie VARCHAR(40) NOT NULL,
  raza VARCHAR(60),
  fecha_nacimiento DATE,
  tutor_id INTEGER NOT NULL REFERENCES tutores(id)
);

CREATE TABLE IF NOT EXISTS citas (
  id SERIAL PRIMARY KEY,
  mascota_id INTEGER NOT NULL REFERENCES mascotas(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(200),
  estado VARCHAR(20) NOT NULL DEFAULT 'programada'
    CHECK (estado IN ('programada','cancelada','atendida')),
  UNIQUE (fecha, hora)
);

CREATE TABLE IF NOT EXISTS atenciones (
  id SERIAL PRIMARY KEY,
  mascota_id INTEGER NOT NULL REFERENCES mascotas(id),
  veterinario_id INTEGER NOT NULL REFERENCES usuarios(id),
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  diagnostico TEXT NOT NULL,
  tratamiento TEXT
);
