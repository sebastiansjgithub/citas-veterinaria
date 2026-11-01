# Registro de cambios

Todos los cambios relevantes del proyecto se documentan aquí. El formato sigue Keep a Changelog y el versionado es semántico.

## [1.0.0] - 2026-11-01

### Agregado
- Inicio de sesión con roles administrador, recepción y veterinario.
- Registro de tutores y mascotas, y asociación mascota-tutor (RF-01, RF-02).
- Agendamiento de citas y consulta de horarios disponibles (RF-03, RF-04).
- Cancelación de citas, que libera el horario (RF-05).
- Control de acceso por rol (RNF-02).
- Comandos `npm run migrate` y `npm run seed` para instalar la base de datos.
- Ruta `/health` para verificar el estado del servidor.

### Pendiente para próximas versiones
- Registro de atenciones veterinarias (RF-06).
- Consulta del historial de atenciones (RF-07), prevista para la 1.1.0.
- Reporte de citas por rango de fechas (RF-08).
