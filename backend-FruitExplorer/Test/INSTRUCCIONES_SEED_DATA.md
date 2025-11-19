# 🌱 Instrucciones para Cargar Datos de Ejemplo

Este documento explica cómo poblar la base de datos de **FruitExplorer** con datos de ejemplo.

---

## 📦 Contenido de los Datos

El archivo `seed_data.sql` contiene datos de ejemplo para todas las tablas:

### Datos Incluidos

| Tabla | Cantidad | Descripción |
|-------|----------|-------------|
| **roles** | 3 | admin, user, editor |
| **users** | 5 | Usuarios de prueba con diferentes roles |
| **user_roles** | 5 | Asignaciones de roles a usuarios |
| **regions** | 6 | América del Sur, Centroamérica, Sudeste Asiático, Mediterráneo, África Tropical, Caribe |
| **fruits** | 12 | Frutas populares con información completa |
| **fruit_regions** | 29 | Relaciones entre frutas y regiones |
| **recipes** | 12 | Recetas con frutas |
| **recipe_steps** | 74 | Pasos detallados para cada receta |
| **fruit_recipes** | 19 | Relaciones entre frutas y recetas |

---

## 🔐 Usuarios de Prueba

Todos los usuarios tienen la misma contraseña para facilitar las pruebas:

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `admin@fruitexplorer.com` | `password123` | admin | Administrador principal |
| `carlos@fruitexplorer.com` | `password123` | admin | Carlos Hernández (admin) |
| `editor@fruitexplorer.com` | `password123` | editor | Editor principal |
| `diego@fruitexplorer.com` | `password123` | editor | Diego García (editor) |
| `usuario@fruitexplorer.com` | `password123` | user | Usuario normal |

> ⚠️ **IMPORTANTE**: Estos datos son solo para desarrollo/pruebas. NO usar en producción.

---

## 🍎 Frutas Incluidas

1. **Mango** - *Mangifera indica*
2. **Banana** - *Musa acuminata*
3. **Papaya** - *Carica papaya*
4. **Piña** - *Ananas comosus*
5. **Fresa** - *Fragaria × ananassa*
6. **Sandía** - *Citrullus lanatus*
7. **Naranja** - *Citrus × sinensis*
8. **Aguacate** - *Persea americana*
9. **Kiwi** - *Actinidia deliciosa*
10. **Pitaya** - *Hylocereus undatus*
11. **Coco** - *Cocos nucifera*
12. **Maracuyá** - *Passiflora edulis*

Cada fruta incluye:
- ✅ Nombre común y científico
- ✅ Descripción completa
- ✅ Información nutricional (JSON)
- ✅ Imagen (URL de Unsplash)
- ✅ Región(es) de origen

---

## 🍽️ Recetas Incluidas

1. Smoothie de Mango y Banana
2. Ensalada Tropical de Frutas
3. Guacamole Tradicional
4. Agua Fresca de Sandía
5. Bowl de Açaí con Fresas
6. Jugo de Naranja Natural
7. Smoothie Bowl de Pitaya
8. Mousse de Maracuyá
9. Ensalada de Papaya Verde
10. Helado de Coco Casero
11. Tarta de Kiwi y Crema
12. Piña Colada Clásica

Cada receta incluye:
- ✅ Título y descripción
- ✅ Pasos detallados
- ✅ Imagen
- ✅ Relación con frutas utilizadas

---

## 📋 Métodos de Carga

### Opción 1: Usando MySQL Client (Recomendado)

```bash
# 1. Asegúrate de que la base de datos existe
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fruitexplorer_db;"

# 2. Carga el archivo SQL
mysql -u root -p fruitexplorer_db < seed_data.sql

# 3. Verifica que los datos se cargaron
mysql -u root -p fruitexplorer_db -e "SELECT COUNT(*) as total_frutas FROM fruits;"
```

### Opción 2: Usando phpMyAdmin

1. Abre phpMyAdmin en tu navegador
2. Selecciona la base de datos `fruitexplorer_db`
3. Ve a la pestaña **"Importar"**
4. Selecciona el archivo `seed_data.sql`
5. Haz clic en **"Continuar"**

### Opción 3: Usando MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. Abre el archivo `seed_data.sql`
4. Ejecuta el script completo (⚡ Lightning icon)

### Opción 4: Usando el Script Node.js (Próximamente)

```bash
# Cargar datos automáticamente desde Node.js
npm run seed
```

---

## ⚠️ Notas Importantes

### Limpieza de Datos

El script **limpia todas las tablas** antes de insertar datos nuevos:

```sql
TRUNCATE TABLE fruit_recipes;
TRUNCATE TABLE fruit_regions;
TRUNCATE TABLE recipe_steps;
TRUNCATE TABLE recipes;
TRUNCATE TABLE fruits;
TRUNCATE TABLE regions;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
```

> ⚠️ **CUIDADO**: Esto eliminará TODOS los datos existentes. Si tienes datos importantes, haz un backup primero.

### Foreign Keys

El script desactiva temporalmente las foreign keys para evitar errores:

```sql
SET FOREIGN_KEY_CHECKS = 0;
-- ... inserts ...
SET FOREIGN_KEY_CHECKS = 1;
```

### Contraseñas

Las contraseñas están hasheadas con **bcrypt**. El hash incluido es un ejemplo genérico. Para que funcionen correctamente en tu aplicación:

**Opción A:** Actualizar los hashes con contraseñas reales:

```javascript
const bcrypt = require('bcrypt');
const password = 'password123';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

**Opción B:** Usar el endpoint de registro para crear usuarios nuevos con contraseñas correctas.

---

## 🧪 Verificar la Carga

Después de ejecutar el script, verifica que los datos se cargaron correctamente:

```sql
-- Contar registros en cada tabla
SELECT 'roles' as tabla, COUNT(*) as total FROM roles
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'regions', COUNT(*) FROM regions
UNION ALL
SELECT 'fruits', COUNT(*) FROM fruits
UNION ALL
SELECT 'fruit_regions', COUNT(*) FROM fruit_regions
UNION ALL
SELECT 'recipes', COUNT(*) FROM recipes
UNION ALL
SELECT 'recipe_steps', COUNT(*) FROM recipe_steps
UNION ALL
SELECT 'fruit_recipes', COUNT(*) FROM fruit_recipes;
```

**Resultado Esperado:**

```
tabla           | total
----------------|------
roles           | 3
users           | 5
user_roles      | 5
regions         | 6
fruits          | 12
fruit_regions   | 29
recipes         | 12
recipe_steps    | 74
fruit_recipes   | 19
```

---

## 🔧 Troubleshooting

### Error: "Unknown database"

```sql
CREATE DATABASE fruitexplorer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Table doesn't exist"

Primero debes crear las tablas. Busca el archivo de esquema (`schema.sql` o similar) y ejecútalo antes de cargar los datos.

### Error: "Duplicate entry"

El script ya limpia las tablas automáticamente. Si sigue ocurriendo:

```sql
DELETE FROM fruit_recipes;
DELETE FROM fruit_regions;
DELETE FROM recipe_steps;
DELETE FROM recipes;
DELETE FROM fruits;
DELETE FROM regions;
DELETE FROM user_roles;
DELETE FROM users;
DELETE FROM roles;
```

### Las contraseñas no funcionan

Actualiza los hashes de contraseñas o registra usuarios nuevos usando el endpoint `/api/auth/register`.

---

## 🚀 Siguiente Paso

Una vez cargados los datos, inicia tu servidor backend:

```bash
cd backend-FruitExplorer
npm install
npm start
```

Y el frontend:

```bash
cd frontend-APP
npm install
npm run dev
```

Luego accede a:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api

Prueba iniciar sesión con:
- **Email**: `admin@fruitexplorer.com`
- **Password**: `password123`

---

## 📝 Personalización

Puedes modificar el archivo `seed_data.sql` para:

- Agregar más frutas
- Crear más recetas
- Añadir más usuarios
- Agregar más regiones
- Cambiar las contraseñas

Solo asegúrate de mantener la estructura correcta de los datos JSON en el campo `nutritional` de las frutas.

---

## 🔗 Referencias

- [Documentación MySQL](https://dev.mysql.com/doc/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Unsplash (imágenes)](https://unsplash.com)

---

**Creado por**: Claude AI
**Fecha**: 19 de noviembre de 2025
**Versión**: 1.0
