# 🧠 Informe de desarrollo del Backend — Proyecto FruitExplorer

## 📘 Descripción general
El backend de **FruitExplorer** está diseñado en **Node.js + Express**, estructurado por módulos y documentado con **Scalar**.  
Se conecta a una base de datos MySQL (a través de XAMPP) que contiene tablas bien normalizadas para manejar usuarios, frutas, regiones, recetas, pasos de preparación, y relaciones entre ellas.

El sistema sigue principios de arquitectura limpia, separación de capas, seguridad con JWT y control de roles administrativos.

---

## ⚙️ Tecnologías principales
- **Node.js + Express** — servidor y API REST.  
- **MySQL (XAMPP)** — base de datos relacional.  
- **JWT (jsonwebtoken)** — autenticación segura.  
- **Bcrypt** — cifrado de contraseñas.  
- **Scalar** — documentación OpenAPI en español.  
- **Dotenv** — configuración de entorno.  
- **Nodemon** — ejecución en desarrollo.  

---

## 🧩 Estructura del proyecto

src/
├── config/
│ └── db.js
├── controllers/
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── role.controller.js
│ ├── fruit.controller.js
│ ├── region.controller.js
│ ├── recipe.controller.js
│ ├── recipeStep.controller.js
│ └── fruitRecipe.controller.js
├── middlewares/
│ ├── auth.middleware.js
│ └── role.middleware.js
├── routes/
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── role.routes.js
│ ├── fruit.routes.js
│ ├── region.routes.js
│ ├── recipe.routes.js
│ ├── recipeStep.routes.js
│ └── fruitRecipe.routes.js
├── docs/
│ └── openapi.js
├── app.js
└── server.js

yaml
Copiar código

---

## 👥 Módulos desarrollados

### 1. Usuarios y Autenticación
- Registro, inicio de sesión y validación JWT.  
- Roles administrados por tabla `user_roles`.  
- Los usuarios externos se crean con rol básico “user”.

### 2. Roles y permisos
- Solo administradores pueden crear, asignar o eliminar roles.  
- Middleware `requireRole('admin')` protege rutas sensibles.  
- Rutas: `/api/roles`, `/api/roles/assign`, `/api/roles/remove`.

### 3. Regiones
- Gestión de regiones del Perú (`regions`).  
- Incluye nombre, descripción, imagen y `geo_polygon`.  
- Endpoints CRUD protegidos para administradores.  
- Rutas: `/api/regions`.

### 4. Frutas
- Registro de frutas con nombre común, científico, descripción y datos nutricionales (`JSONB`).  
- Asociadas a regiones por la tabla `fruit_regions`.  
- Rutas: `/api/fruits`, `/api/fruits/assign-region`.

### 5. Recetas
- CRUD completo de recetas (`recipes`).  
- Cada receta puede tener múltiples pasos y frutas asociadas.  
- Endpoints públicos para listar y buscar recetas.  
- Rutas: `/api/recipes`.

### 6. Pasos de receta
- Módulo `recipe_steps` para detallar instrucciones paso a paso.  
- Solo administradores pueden agregar, editar o eliminar pasos.  
- Rutas: `/api/recipe-steps`.

### 7. Asociación Fruta–Receta
- Tabla `fruit_recipes` conecta frutas con recetas.  
- Permite listar recetas por fruta o frutas por receta.  
- Rutas: `/api/fruit-recipes`.

---

## 🔒 Seguridad y autenticación
- Cada endpoint requiere **token JWT válido** (`Bearer <token>`).  
- Las acciones críticas requieren **rol admin**.  
- Se usa `bcrypt` para el cifrado de contraseñas.  
- Los tokens incluyen expiración y se generan al iniciar sesión.

---

## 📘 Documentación con Scalar
- Todos los módulos están documentados en español.  
- Acceso local: `http://localhost:3000/docs`  
- Scalar muestra endpoints, parámetros, ejemplos y autenticación.

---

## 💡 Compatibilidad y consumo
El backend está diseñado para ser consumido por:
- **Frontend Web:** React + Vite.  
- **Aplicación Móvil:** Android (Java puro).  

Ambos pueden usar las mismas rutas gracias al diseño REST uniforme y las respuestas en formato JSON.

---

## 🧱 Estado actual
| Módulo | Estado | Acceso |
|--------|---------|--------|
| Usuarios | ✅ Completo | Público (con registro/login) |
| Roles | ✅ Completo | Solo admin |
| Regiones | ✅ Completo | CRUD protegido |
| Frutas | ✅ Completo | CRUD protegido |
| Recetas | ✅ Completo | Público y admin |
| Pasos de receta | ✅ Completo | Admin |
| Asociación Fruta–Receta | ✅ Completo | Admin |
| Documentación Scalar | ✅ Activa | `/docs` |

---

## 🚀 Próximo módulo
**ML Models:**  
Gestión de modelos de Machine Learning (`ml_models`) para detección de frutas, entrenamiento, versiones y datasets.

---

## 📍 Conclusión
El backend de **FruitExplorer** se encuentra sólido, modular y listo para integrarse con el frontend web y la app móvil.  
Cumple con las normas REST, seguridad por roles, y documentación técnica profesional.