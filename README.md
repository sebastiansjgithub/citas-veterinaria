# Sistema de Gestión de Citas y Atención Veterinaria

Prototipo académico para Bivett - Hospital Veterinario Castropol. Centraliza el registro de tutores y mascotas y la programación de citas. Proyecto de Ingeniería de Requisitos (Fundación Universitaria Católica del Norte). Los datos de prueba son ficticios.

## Funcionalidades (versión 1.0.0)

- RF-01 y RF-02: registrar tutores y mascotas, y asociar cada mascota a un tutor.
- RF-03: agendar una cita para una mascota.
- RF-04: consultar los horarios disponibles de una fecha.
- RF-05: cancelar una cita, lo que libera su horario.
- Inicio de sesión con tres roles: administrador, recepción y veterinario.
- Control de acceso por rol (RNF-02): el veterinario solo consulta.

## Tecnologías

Node.js, Express, PostgreSQL, bcryptjs (claves cifradas) y JSON Web Tokens (sesión). Interfaz en HTML, CSS y JavaScript.

## Requisitos

- Node.js 22 LTS o superior (probado con v26.13.0)
- PostgreSQL 16 o superior (probado con 18.6)
- Git 2.34 o superior

## Instalación

1. Clonar el repositorio: `git clone https://github.com/sebastiansjgithub/citas-veterinaria.git` y entrar con `cd citas-veterinaria`.
2. Instalar dependencias: `npm install`.
3. Crear la base de datos: `createdb citas_vet`.
4. Copiar la configuración: `cp .env.example .env` y editar `DATABASE_URL` y `JWT_SECRET`.
5. Crear las tablas: `npm run migrate`.
6. Crear los usuarios de prueba: `npm run seed`.
7. Iniciar el servidor: `npm start`.
8. Verificar en el navegador: `http://localhost:3000/health` debe responder `{"status":"ok","baseDeDatos":"conectada"}`.

## Usuarios de prueba

| Correo | Clave | Rol |
|---|---|---|
| admin@bivett.test | Admin123* | administrador |
| ana@bivett.test | Clave123* | recepcion |
| carlos@bivett.test | Vet123* | veterinario |

## Estructura

- `src/`: servidor, autenticación, rutas de pacientes y citas.
- `db/`: esquema de la base de datos y migraciones.
- `public/`: pantallas (login, panel, mascotas y citas).

## Versionado y cambios

Se usa versionado semántico (MAYOR.MENOR.PARCHE). El detalle de cada versión está en CHANGELOG.md.
