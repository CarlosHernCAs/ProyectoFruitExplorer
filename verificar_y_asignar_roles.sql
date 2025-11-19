-- 🔍 VERIFICAR Y ASIGNAR ROLES
-- Este script te ayuda a verificar que los usuarios tengan roles asignados

USE fruitexplorer_db;

-- 1️⃣ Ver todas las tablas relacionadas con roles
SELECT '=== TABLA ROLES ===' as info;
SELECT * FROM roles;

SELECT '=== TABLA USER_ROLES ===' as info;
SELECT * FROM user_roles;

-- 2️⃣ Ver todos los usuarios con sus roles (si los tienen)
SELECT '=== USUARIOS CON ROLES ===' as info;
SELECT
  u.id,
  u.email,
  u.display_name,
  r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
ORDER BY u.email;

-- 3️⃣ Encontrar usuarios SIN rol asignado
SELECT '=== USUARIOS SIN ROL ASIGNADO ===' as info;
SELECT
  u.id,
  u.email,
  u.display_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- 4️⃣ INSTRUCCIONES PARA ASIGNAR ROLES:
-- Si encuentras usuarios sin rol, ejecuta uno de estos comandos:

-- Para asignar rol ADMIN a un usuario específico (reemplaza 'admin@fruitexplorer.com' con tu email):
/*
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@fruitexplorer.com'
AND r.name = 'admin'
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
);
*/

-- Para asignar rol USER a un usuario específico:
/*
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'usuario@example.com'
AND r.name = 'user'
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
);
*/

-- Para asignar rol USER a TODOS los usuarios que no tengan rol:
/*
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE r.name = 'user'
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
);
*/
