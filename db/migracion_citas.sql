ALTER TABLE citas DROP CONSTRAINT IF EXISTS citas_fecha_hora_key;
CREATE UNIQUE INDEX IF NOT EXISTS citas_horario_activo
  ON citas (fecha, hora) WHERE estado <> 'cancelada';
