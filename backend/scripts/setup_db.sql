-- Configuración inicial de la base de datos de Clima RD (ejecutar UNA sola vez)
-- Uso:
--   Windows (PowerShell):
--     psql -h localhost -U postgres -p 5432 -f setup_db.sql
--   Linux/Mac:
--     psql -h localhost -U postgres -d postgres -f setup_db.sql
-- Se te pedirá la contraseña del usuario superusuario de tu PostgreSQL.

-- 1. Crear el rol de la aplicación (si no existe)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'climard') THEN
      CREATE ROLE climard LOGIN PASSWORD 'climard_dev_2026';
   END IF;
END
$$;

-- 2. Crear la base de datos (si no existe)
SELECT 'CREATE DATABASE climard OWNER climard'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'climard')
\gexec

-- 3. (Opcional) Activar PostGIS para consultas espaciales, solo si tienes la extensión instalada
-- \c climard
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- 4. El resto (tablas + 32 provincias) lo hace el backend automáticamente al arrancar.