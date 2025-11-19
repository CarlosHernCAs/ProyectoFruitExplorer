# 🌱 Datos de Prueba para FruitExplorer

Este documento te ayudará a poblar rápidamente la base de datos con datos de ejemplo.

---

## 🚀 Método Rápido (Recomendado)

### 1. Asegúrate de tener la base de datos creada

```bash
# Conéctate a MySQL
mysql -u root -p

# Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS fruitexplorer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 2. Configura las variables de entorno

Asegúrate de que tu archivo `.env` en `backend-FruitExplorer/` tenga la configuración correcta:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fruitexplorer_db
```

### 3. Ejecuta el script de seed

```bash
cd backend-FruitExplorer
npm run seed
```

¡Listo! En segundos tendrás la base de datos llena de datos.

---

## 📦 ¿Qué datos se cargan?

### 👥 5 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| `admin@fruitexplorer.com` | `password123` | admin |
| `carlos@fruitexplorer.com` | `password123` | admin |
| `editor@fruitexplorer.com` | `password123` | editor |
| `diego@fruitexplorer.com` | `password123` | editor |
| `usuario@fruitexplorer.com` | `password123` | user |

### 🌍 6 Regiones

- América del Sur
- Centroamérica
- Sudeste Asiático
- Mediterráneo
- África Tropical
- Caribe

### 🍎 12 Frutas

1. **Mango** - Mangifera indica
2. **Banana** - Musa acuminata
3. **Papaya** - Carica papaya
4. **Piña** - Ananas comosus
5. **Fresa** - Fragaria × ananassa
6. **Sandía** - Citrullus lanatus
7. **Naranja** - Citrus × sinensis
8. **Aguacate** - Persea americana
9. **Kiwi** - Actinidia deliciosa
10. **Pitaya** - Hylocereus undatus
11. **Coco** - Cocos nucifera
12. **Maracuyá** - Passiflora edulis

Cada fruta incluye:
- ✅ Nombre común y científico
- ✅ Descripción detallada
- ✅ Información nutricional completa (calorías, carbohidratos, vitaminas, etc.)
- ✅ Imagen de alta calidad
- ✅ Región(es) de origen

### 🍽️ 12 Recetas

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
- ✅ Imagen ilustrativa
- ✅ Relación con frutas utilizadas

---

## 🧪 Prueba la Aplicación

### 1. Inicia el Backend

```bash
cd backend-FruitExplorer
npm install
npm start
```

El backend estará disponible en: **http://localhost:4000**

### 2. Inicia el Frontend

```bash
cd frontend-APP
npm install
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

### 3. Inicia Sesión

1. Abre tu navegador en **http://localhost:5173**
2. Haz clic en **"Login"**
3. Usa las credenciales:
   - **Email**: `admin@fruitexplorer.com`
   - **Password**: `password123`

### 4. Explora la Aplicación

Como administrador, tendrás acceso completo a:

- ✅ **Ver todas las frutas** (`/fruits`)
- ✅ **Ver detalles de frutas** con recetas relacionadas
- ✅ **Agregar, editar y eliminar frutas**
- ✅ **Ver todas las recetas** (`/recipes`)
- ✅ **Crear, editar y eliminar recetas**
- ✅ **Ver regiones** (`/regions`)
- ✅ **Gestionar regiones**
- ✅ **Gestionar usuarios** (`/users`)

---

## 🔄 ¿Necesitas Resetear los Datos?

Si quieres volver a cargar los datos desde cero:

```bash
cd backend-FruitExplorer
npm run seed
```

> ⚠️ **ADVERTENCIA**: Esto borrará TODOS los datos existentes y los reemplazará con los datos de ejemplo.

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `backend-FruitExplorer/seed_data.sql` | Archivo SQL puro con todos los datos |
| `backend-FruitExplorer/seedDatabase.js` | Script Node.js para cargar datos automáticamente |
| `backend-FruitExplorer/INSTRUCCIONES_SEED_DATA.md` | Documentación detallada completa |

---

## 🛠️ Método Alternativo: SQL Directo

Si prefieres ejecutar el SQL manualmente:

```bash
cd backend-FruitExplorer
mysql -u root -p fruitexplorer_db < seed_data.sql
```

---

## ❓ Troubleshooting

### Error: "Cannot find module './src/utils/hash.js'"

Asegúrate de que existe el archivo `src/utils/hash.js` con la función `hashPassword`:

```javascript
import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
```

### Error: "Table doesn't exist"

Primero debes crear las tablas. Busca el archivo de esquema de la base de datos (`schema.sql` o migrations) y ejecútalo antes del seed.

### Error: "Access denied for user"

Verifica que tus credenciales en el archivo `.env` sean correctas.

### Las contraseñas no funcionan

El script usa `bcrypt` para hashear las contraseñas. Si las contraseñas no funcionan, registra un nuevo usuario desde el frontend.

---

## 📊 Verificar Datos Cargados

Después de ejecutar el seed, puedes verificar que los datos se cargaron correctamente:

```bash
mysql -u root -p fruitexplorer_db
```

```sql
-- Ver cantidad de registros en cada tabla
SELECT 'roles' as tabla, COUNT(*) as total FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'fruits', COUNT(*) FROM fruits
UNION ALL SELECT 'recipes', COUNT(*) FROM recipes
UNION ALL SELECT 'regions', COUNT(*) FROM regions;
```

**Resultado esperado:**

```
tabla    | total
---------|------
roles    | 3
users    | 5
fruits   | 12
recipes  | 12
regions  | 6
```

---

## 🎯 Próximos Pasos

Una vez que tengas los datos cargados:

1. **Explora la aplicación web** en http://localhost:5173
2. **Prueba crear nuevas frutas** como admin
3. **Crea tus propias recetas**
4. **Experimenta con las relaciones** entre frutas y recetas
5. **Prueba los diferentes roles** (admin, editor, user)

---

## 📝 Notas Importantes

- ⚠️ Estos datos son **solo para desarrollo/pruebas**
- ⚠️ **NO usar en producción** sin cambiar las contraseñas
- ✅ Las imágenes usan URLs de **Unsplash** (requieren internet)
- ✅ Los datos nutricionales son **aproximados** (fines educativos)
- ✅ El script es **idempotente** (puedes ejecutarlo múltiples veces)

---

## 🤝 Contribuir

Si quieres agregar más datos de ejemplo:

1. Edita `backend-FruitExplorer/seedDatabase.js`
2. Agrega tus frutas, recetas o regiones
3. Ejecuta `npm run seed` para verificar
4. Comparte tus mejoras con el equipo

---

**¡Disfruta explorando frutas! 🍎🍌🍊🥑🍉**

---

**Creado por**: Claude AI
**Fecha**: 19 de noviembre de 2025
**Versión**: 1.0
