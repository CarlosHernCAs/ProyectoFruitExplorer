# Análisis de Integración Backend ↔ Frontend Web

## 📊 Estado de Conexión: 35% Conectado

**Última actualización:** 19 de noviembre de 2025

---

## 🔗 URLs de Conexión

### Backend
```javascript
// backend-FruitExplorer/src/server.js
const PORT = process.env.PORT || 3000;
// Servidor corriendo en: http://localhost:3000
```

### Frontend Web Admin
```javascript
// frontend-APP/src/services/api.js
const API_URL = "http://localhost:4000/api";  // ⚠️ PUERTO INCORRECTO

// frontend-APP/src/services/apiFetch.js
const API_BASE_URL = "http://localhost:3000/api";  // ✅ CORRECTO
```

### ⚠️ **PROBLEMA CRÍTICO #1: Inconsistencia de URLs**

El frontend tiene **DOS archivos diferentes** con URLs distintas:
- `api.js` → http://localhost:**4000**/api (INCORRECTO)
- `apiFetch.js` → http://localhost:**3000**/api (CORRECTO)

**Impacto:**
- `fruitService.js` usa `api.js` → ❌ **NO FUNCIONA**
- `UsersPage.jsx` usa `apiFetch.js` → ✅ Funciona
- `authService.js` usa `apiFetch.js` → ✅ Funciona

---

## 📋 Matriz de Integración Completa

### ✅ Módulo: Autenticación (100% conectado)

| Endpoint Backend | Método | Frontend Service | Estado | Usado En |
|------------------|--------|------------------|--------|----------|
| `/api/auth/login` | POST | `authService.login()` | ✅ | login.jsx |
| `/api/auth/register` | POST | `authService.register()` | ✅ | register.jsx |
| `/api/auth/register` | POST | `userService.registerUser()` | ✅ | UsersPage.jsx |

**Funcionalidad:** Login y registro funcionan correctamente.

---

### ⚠️ Módulo: Frutas (60% conectado)

| Endpoint Backend | Método | Frontend Service | Estado | Usado En |
|------------------|--------|------------------|--------|----------|
| `/api/fruits` | GET | `fruitService.getFruits()` | ⚠️ | Home.jsx, FruitList.jsx |
| `/api/fruits/:id` | GET | `fruitService.getFruitById()` | ⚠️ | EditFruit.jsx |
| `/api/fruits/slug/:slug` | GET | ❌ No implementado | ❌ | - |
| `/api/fruits` | POST | `fruitService.createFruit()` | ⚠️ | AddFruit.jsx |
| `/api/fruits/:id` | PUT | `fruitService.updateFruit()` | ⚠️ | EditFruit.jsx |
| `/api/fruits/:id` | DELETE | `fruitService.deleteFruit()` | ⚠️ | Home.jsx |
| `/api/fruits/:id/recipes` | GET | ❌ No implementado | ❌ | - |
| `/api/fruits/:id/sync` | POST | ❌ No implementado | ❌ | - |

**Estado:** ⚠️ **ROTO - URL incorrecta en api.js**

**Código actual (INCORRECTO):**
```javascript
// frontend-APP/src/services/fruitService.js
import { apiFetch } from "./api";  // ← Usa puerto 4000 (MALO)

export const getFruits = () => apiFetch("/fruits");
```

**Solución:**
```javascript
// Cambiar a:
import { apiFetch } from "./apiFetch";  // ← Usa puerto 3000 (CORRECTO)
```

---

### ⚠️ Módulo: Usuarios (50% conectado)

| Endpoint Backend | Método | Frontend Service | Estado | Usado En |
|------------------|--------|------------------|--------|----------|
| `/api/users` | GET | `userService.getAllUsers()` | ⚠️ | UsersPage.jsx |
| `/api/users/:id` | GET | ❌ No implementado | ❌ | - |
| `/api/users/update` | PUT | ❌ No implementado | ❌ | - |
| `/api/users/:id` | DELETE | ❌ No implementado | ❌ | - |
| `/api/users/assign-role` | POST | ❌ No implementado | ❌ | - |
| `/api/users/remove-role` | POST | ❌ No implementado | ❌ | - |

**Problemas:**

1. **URL incorrecta en userService.js:**
```javascript
// ACTUAL (INCORRECTO):
export const getAllUsers = () => {
  return apiFetch("/user");  // ← Falta 's' al final
};

// CORRECTO:
export const getAllUsers = () => {
  return apiFetch("/users");  // ← Debe ser /users
};
```

2. **Falta implementar:**
   - Ver perfil de usuario
   - Actualizar perfil
   - Eliminar usuario
   - Asignar/remover roles

---

### ❌ Módulo: Recetas (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/recipes` | GET | ❌ | No existe |
| `/api/recipes/:id` | GET | ❌ | No existe |
| `/api/recipes` | POST | ❌ | No existe |
| `/api/recipes/:id` | PUT | ❌ | No existe |
| `/api/recipes/:id` | DELETE | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO en frontend web**

El backend tiene un módulo completo de recetas, pero el frontend web no tiene:
- ❌ Ninguna página para recetas
- ❌ Ningún servicio para recetas
- ❌ Ninguna ruta en App.jsx

**Nota:** Solo el frontend Android usa recetas.

---

### ❌ Módulo: Regiones (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/regions` | GET | ❌ | No existe |
| `/api/regions/:id` | GET | ❌ | No existe |
| `/api/regions/:id/fruits` | GET | ❌ | No existe |
| `/api/regions` | POST | ❌ | No existe |
| `/api/regions/:id` | PUT | ❌ | No existe |
| `/api/regions/:id` | DELETE | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO en frontend web**

---

### ❌ Módulo: Relación Frutas-Recetas (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/fruit-recipes` | POST | ❌ | No existe |
| `/api/fruit-recipes` | DELETE | ❌ | No existe |
| `/api/fruit-recipes/by-recipe/:id` | GET | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO**

---

### ❌ Módulo: Pasos de Receta (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/steps/:recipe_id` | GET | ❌ | No existe |
| `/api/steps/:recipe_id` | POST | ❌ | No existe |
| `/api/steps/:id` | PUT | ❌ | No existe |
| `/api/steps/:id` | DELETE | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO**

---

### ❌ Módulo: Roles (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/roles` | GET | ❌ | No existe |
| `/api/roles` | POST | ❌ | No existe |
| `/api/roles/:id` | DELETE | ❌ | No existe |
| `/api/roles/assign` | POST | ❌ | No existe |
| `/api/roles/remove` | POST | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO**

Actualmente no hay gestión de roles desde el frontend web.

---

### ❌ Módulo: Queries/Búsquedas (0% conectado)

| Endpoint Backend | Método | Frontend | Estado |
|------------------|--------|----------|--------|
| `/api/queries/log` | POST | ❌ | No existe |
| `/api/queries/:id/voice` | PUT | ❌ | No existe |

**Estado:** ❌ **NO IMPLEMENTADO**

Este módulo es usado por el frontend Android para logging de búsquedas ML.

---

## 📊 Resumen de Integración

### Por Módulo

| Módulo | Endpoints Backend | Implementados Frontend | % Conexión |
|--------|-------------------|------------------------|------------|
| **Autenticación** | 2 | 2 | ✅ 100% |
| **Frutas** | 8 | 5 (rotos) | ⚠️ 62% |
| **Usuarios** | 6 | 1 (roto) | ⚠️ 17% |
| **Recetas** | 5 | 0 | ❌ 0% |
| **Regiones** | 6 | 0 | ❌ 0% |
| **Frutas-Recetas** | 3 | 0 | ❌ 0% |
| **Pasos Receta** | 4 | 0 | ❌ 0% |
| **Roles** | 5 | 0 | ❌ 0% |
| **Queries** | 2 | 0 | ❌ 0% |

### Global

```
Total de endpoints backend: 41
Endpoints conectados: 8
Endpoints con bugs: 6
Endpoints sin implementar: 27

Porcentaje real funcionando: 19.5%
Porcentaje implementado (con bugs): 34.1%
```

---

## 🐛 Bugs Identificados

### 🔴 Bug #1: Inconsistencia de URLs

**Archivos afectados:**
- `frontend-APP/src/services/api.js` → Puerto **4000** ❌
- `frontend-APP/src/services/apiFetch.js` → Puerto **3000** ✅

**Impacto:**
- **TODOS** los endpoints de frutas fallan
- Login/Registro funcionan (usan apiFetch.js)
- Gestión de usuarios funciona parcialmente

**Solución:**
```javascript
// Opción 1: Eliminar api.js y usar solo apiFetch.js
// Cambiar en fruitService.js:
import { apiFetch } from "./apiFetch";  // en lugar de "./api"

// Opción 2: Corregir api.js
const API_URL = "http://localhost:3000/api";  // cambiar 4000 → 3000
```

---

### 🔴 Bug #2: Endpoint incorrecto de usuarios

**Archivo:** `frontend-APP/src/services/userService.js`

```javascript
// ACTUAL (MAL):
export const getAllUsers = () => {
  return apiFetch("/user");  // ← Singular
};

// CORRECTO:
export const getAllUsers = () => {
  return apiFetch("/users");  // ← Plural
};
```

**Resultado:**
- Backend espera: `/api/users`
- Frontend llama: `/api/user`
- Error: 404 Not Found

---

### 🟡 Bug #3: Falta manejo de respuesta en getFruitById

**Archivo:** `frontend-APP/src/pages/EditFruit.jsx`

```javascript
const data = await getFruitById(id);
setForm(data.fruta);  // ← Asume que viene en data.fruta
```

**Problema:** Si el backend devuelve la estructura diferente, fallará.

**Solución:** Verificar estructura de respuesta del backend:
```javascript
// Backend debería devolver:
{
  "success": true,
  "fruta": { ... }
}
```

---

## ✅ Funcionalidades que SÍ funcionan

### 1. Login ✅
```
Usuario → login.jsx → authService.login() → apiFetch.js → Backend
```

**Flujo completo:**
1. Usuario ingresa email y password
2. `authService.login()` hace POST a `/api/auth/login`
3. Backend valida credenciales
4. Backend retorna JWT + datos de usuario
5. Frontend guarda token en localStorage
6. AuthContext actualiza estado global
7. Redirección a `/home`

---

### 2. Registro ✅
```
Usuario → register.jsx → authService.register() → apiFetch.js → Backend
```

**Flujo completo:**
1. Usuario ingresa email, password, display_name
2. `authService.register()` hace POST a `/api/auth/register`
3. Backend crea usuario en DB
4. Frontend muestra mensaje de éxito
5. Redirección a `/login`

---

### 3. Listar usuarios (parcial) ⚠️
```
Admin → UsersPage.jsx → apiFetch("/users") → Backend
```

**Problema:** Ruta incorrecta `/user` en lugar de `/users`

**Una vez corregido funcionará:**
1. Admin accede a `/users`
2. `loadUsers()` hace GET a `/api/users`
3. Backend retorna lista de usuarios
4. Frontend muestra tabla con usuarios

---

## ❌ Funcionalidades ROTAS

### 1. CRUD de Frutas (Todas rotas) 🔴

**Razón:** URL incorrecta en `api.js`

#### Listar frutas
```javascript
// Home.jsx y FruitList.jsx
const data = await getFruits();  // → http://localhost:4000/api/fruits ❌
```

#### Crear fruta
```javascript
// AddFruit.jsx
await createFruit(form);  // → http://localhost:4000/api/fruits ❌
```

#### Editar fruta
```javascript
// EditFruit.jsx
const data = await getFruitById(id);      // → 4000 ❌
await updateFruit(id, form);              // → 4000 ❌
```

#### Eliminar fruta
```javascript
// Home.jsx
await deleteFruit(id);  // → http://localhost:4000/api/fruits/:id ❌
```

**Error que ve el usuario:**
```
Failed to fetch
Network error: http://localhost:4000/api/fruits
```

---

## 📝 Features Faltantes (Backend listo, Frontend no)

### 1. Módulo de Recetas

**Backend disponible:**
- ✅ GET `/api/recipes` - Listar recetas
- ✅ GET `/api/recipes/:id` - Ver detalle
- ✅ POST `/api/recipes` - Crear receta
- ✅ PUT `/api/recipes/:id` - Actualizar receta
- ✅ DELETE `/api/recipes/:id` - Eliminar receta

**Frontend necesita:**
- [ ] Página `RecipeList.jsx`
- [ ] Página `RecipeDetail.jsx`
- [ ] Página `AddRecipe.jsx`
- [ ] Página `EditRecipe.jsx`
- [ ] Servicio `recipeService.js`
- [ ] Rutas en `App.jsx`

---

### 2. Módulo de Regiones

**Backend disponible:**
- ✅ GET `/api/regions` - Listar regiones
- ✅ GET `/api/regions/:id` - Ver detalle
- ✅ GET `/api/regions/:id/fruits` - Frutas por región
- ✅ POST `/api/regions` - Crear región
- ✅ PUT `/api/regions/:id` - Actualizar región
- ✅ DELETE `/api/regions/:id` - Eliminar región

**Frontend necesita:**
- [ ] Página `RegionList.jsx`
- [ ] Página `RegionDetail.jsx`
- [ ] Página `AddRegion.jsx`
- [ ] Página `EditRegion.jsx`
- [ ] Servicio `regionService.js`
- [ ] Rutas en `App.jsx`

---

### 3. Búsqueda por Slug

**Backend disponible:**
- ✅ GET `/api/fruits/slug/:slug` - Buscar fruta por slug

**Frontend necesita:**
- [ ] Implementar en `fruitService.js`:
```javascript
export const getFruitBySlug = (slug) =>
  apiFetch(`/fruits/slug/${slug}`);
```

**Uso potencial:**
- URLs amigables: `/fruits/manzana` en lugar de `/fruits/123`
- SEO mejorado

---

### 4. Recetas de una Fruta

**Backend disponible:**
- ✅ GET `/api/fruits/:id/recipes` - Recetas de una fruta específica

**Frontend necesita:**
- [ ] Implementar en `fruitService.js`:
```javascript
export const getFruitRecipes = (fruitId) =>
  apiFetch(`/fruits/${fruitId}/recipes`);
```

- [ ] Componente `FruitRecipes.jsx`
- [ ] Integrar en `FruitDetail.jsx` (cuando se cree)

---

### 5. Gestión de Roles

**Backend disponible:**
- ✅ GET `/api/roles` - Listar roles
- ✅ POST `/api/roles` - Crear rol
- ✅ DELETE `/api/roles/:id` - Eliminar rol
- ✅ POST `/api/users/assign-role` - Asignar rol a usuario
- ✅ POST `/api/users/remove-role` - Remover rol de usuario

**Frontend necesita:**
- [ ] Página `RoleManagement.jsx`
- [ ] Servicio `roleService.js`
- [ ] Dropdown de roles en `UsersPage.jsx`
- [ ] Botones asignar/remover roles

---

### 6. Actualizar Perfil de Usuario

**Backend disponible:**
- ✅ PUT `/api/users/update` - Actualizar perfil propio

**Frontend necesita:**
- [ ] Página `Profile.jsx`
- [ ] Formulario de edición
- [ ] Implementar en `userService.js`:
```javascript
export const updateProfile = (data) =>
  apiFetch("/users/update", {
    method: "PUT",
    body: JSON.stringify(data)
  });
```

---

### 7. Eliminar Usuario

**Backend disponible:**
- ✅ DELETE `/api/users/:id` - Eliminar usuario (solo admin)

**Frontend necesita:**
- [ ] Botón eliminar en `UsersPage.jsx`
- [ ] Implementar en `userService.js`:
```javascript
export const deleteUser = (id) =>
  apiFetch(`/users/${id}`, { method: "DELETE" });
```

---

## 🔧 Plan de Corrección

### Fase 1: Correcciones Críticas (1 hora)

#### 1.1 Corregir URLs ⚡ URGENTE

**Opción A: Consolidar en apiFetch.js (RECOMENDADO)**

```javascript
// 1. Borrar archivo: frontend-APP/src/services/api.js

// 2. Actualizar fruitService.js:
import { apiFetch } from "./apiFetch";  // cambiar de "./api"

export const getFruits = () => apiFetch("/fruits");
export const getFruitById = (id) => apiFetch(`/fruits/${id}`);
// ... resto igual
```

**Opción B: Corregir api.js**

```javascript
// frontend-APP/src/services/api.js
const API_URL = "http://localhost:3000/api";  // cambiar 4000 → 3000
```

#### 1.2 Corregir endpoint de usuarios

```javascript
// frontend-APP/src/services/userService.js
export const getAllUsers = () => {
  return apiFetch("/users");  // cambiar "/user" → "/users"
};
```

#### 1.3 Verificar y hacer commit

```bash
# Probar endpoints:
# 1. Login
# 2. Listar frutas
# 3. Crear fruta
# 4. Listar usuarios

git add .
git commit -m "fix: corregir URLs de API y endpoint de usuarios"
```

---

### Fase 2: Completar Features Básicas (1 semana)

#### 2.1 Completar servicio de frutas

```javascript
// frontend-APP/src/services/fruitService.js

// Agregar:
export const getFruitBySlug = (slug) =>
  apiFetch(`/fruits/slug/${slug}`);

export const getFruitRecipes = (fruitId) =>
  apiFetch(`/fruits/${fruitId}/recipes`);
```

#### 2.2 Completar servicio de usuarios

```javascript
// frontend-APP/src/services/userService.js

// Agregar:
export const getUserById = (id) =>
  apiFetch(`/users/${id}`);

export const updateProfile = (data) =>
  apiFetch("/users/update", {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteUser = (id) =>
  apiFetch(`/users/${id}`, { method: "DELETE" });

export const assignRole = (userId, roleId) =>
  apiFetch("/users/assign-role", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role_id: roleId })
  });

export const removeRole = (userId, roleId) =>
  apiFetch("/users/remove-role", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role_id: roleId })
  });
```

#### 2.3 Mejorar UsersPage.jsx

- [ ] Agregar botón "Eliminar" por usuario
- [ ] Agregar selector de roles
- [ ] Implementar asignar/remover roles
- [ ] Agregar confirmación antes de eliminar

---

### Fase 3: Implementar Recetas (2 semanas)

#### 3.1 Crear servicio de recetas

```javascript
// frontend-APP/src/services/recipeService.js
import { apiFetch } from "./apiFetch";

export const getRecipes = () => apiFetch("/recipes");
export const getRecipeById = (id) => apiFetch(`/recipes/${id}`);
export const createRecipe = (data) =>
  apiFetch("/recipes", {
    method: "POST",
    body: JSON.stringify(data)
  });
export const updateRecipe = (id, data) =>
  apiFetch(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
export const deleteRecipe = (id) =>
  apiFetch(`/recipes/${id}`, { method: "DELETE" });
```

#### 3.2 Crear páginas

- [ ] `RecipeList.jsx` - Listar recetas
- [ ] `RecipeDetail.jsx` - Ver detalle
- [ ] `AddRecipe.jsx` - Crear receta
- [ ] `EditRecipe.jsx` - Editar receta

#### 3.3 Agregar rutas en App.jsx

```javascript
<Route path="/recipes" element={<RecipeList />} />
<Route path="/recipes/:id" element={<RecipeDetail />} />
<Route path="/recipes/add" element={
  <ProtectedRoute><AddRecipe /></ProtectedRoute>
} />
<Route path="/recipes/edit/:id" element={
  <ProtectedRoute><EditRecipe /></ProtectedRoute>
} />
```

---

### Fase 4: Implementar Regiones (2 semanas)

Similar a Recetas:
- [ ] `regionService.js`
- [ ] Páginas: List, Detail, Add, Edit
- [ ] Rutas en App.jsx
- [ ] Integración con frutas (mostrar frutas por región)

---

### Fase 5: Features Avanzadas (4 semanas)

- [ ] Gestión de roles desde UI
- [ ] Relación Frutas-Recetas visual
- [ ] Pasos de recetas
- [ ] Búsqueda avanzada
- [ ] Filtros y ordenamiento
- [ ] Paginación

---

## 🎯 Estado Objetivo (100% Conectado)

### Servicios completos

```
services/
├── apiFetch.js          ✅ (base común)
├── authService.js       ✅
├── fruitService.js      ⚠️ (completar)
├── userService.js       ⚠️ (completar)
├── recipeService.js     ❌ (crear)
├── regionService.js     ❌ (crear)
├── roleService.js       ❌ (crear)
└── stepService.js       ❌ (crear)
```

### Páginas completas

```
pages/
├── auth/
│   ├── Login.jsx        ✅
│   └── Register.jsx     ✅
├── fruits/
│   ├── FruitList.jsx    ✅
│   ├── FruitDetail.jsx  ❌ (crear)
│   ├── AddFruit.jsx     ✅
│   └── EditFruit.jsx    ✅
├── recipes/
│   ├── RecipeList.jsx   ❌
│   ├── RecipeDetail.jsx ❌
│   ├── AddRecipe.jsx    ❌
│   └── EditRecipe.jsx   ❌
├── regions/
│   ├── RegionList.jsx   ❌
│   ├── RegionDetail.jsx ❌
│   ├── AddRegion.jsx    ❌
│   └── EditRegion.jsx   ❌
├── users/
│   ├── UsersPage.jsx    ✅
│   ├── Profile.jsx      ❌ (crear)
│   └── RolesPage.jsx    ❌ (crear)
└── Home.jsx             ✅
```

---

## 📊 Priorización de Tareas

### 🔴 Prioridad CRÍTICA (Hacer YA)

1. **Corregir URLs de API** (15 min)
   - Eliminar `api.js` o cambiar puerto a 3000
   - Actualizar imports en `fruitService.js`

2. **Corregir endpoint /users** (5 min)
   - Cambiar `/user` → `/users` en `userService.js`

3. **Probar CRUD de frutas** (30 min)
   - Verificar todas las operaciones funcionen

**Tiempo total:** ~1 hora
**Impacto:** Restaura funcionalidad básica

---

### 🟠 Prioridad ALTA (Esta semana)

4. **Completar servicio de frutas** (2 horas)
   - Agregar getFruitBySlug
   - Agregar getFruitRecipes
   - Crear FruitDetail.jsx

5. **Completar servicio de usuarios** (3 horas)
   - Implementar deleteUser
   - Implementar updateProfile
   - Implementar assign/remove roles
   - Mejorar UsersPage.jsx

**Tiempo total:** ~5 horas
**Impacto:** Features completas de admin

---

### 🟡 Prioridad MEDIA (Próximas 2 semanas)

6. **Implementar módulo de Recetas** (10 horas)
   - Servicio completo
   - 4 páginas (List, Detail, Add, Edit)
   - Rutas y navegación
   - Relación con frutas

7. **Implementar módulo de Regiones** (8 horas)
   - Servicio completo
   - 4 páginas
   - Rutas
   - Mostrar frutas por región

**Tiempo total:** ~18 horas
**Impacto:** Paridad con frontend Android

---

### 🟢 Prioridad BAJA (Futuro)

8. **Gestión de roles** (6 horas)
9. **Pasos de recetas** (4 horas)
10. **Búsqueda avanzada** (8 horas)
11. **Filtros y paginación** (6 horas)

---

## ✅ Checklist de Validación

### Para considerar "Conectado al 100%":

#### Backend ↔ Frontend
- [ ] Todas las rutas públicas funcionan
- [ ] Todas las rutas protegidas funcionan
- [ ] JWT se envía correctamente en headers
- [ ] Errores se manejan apropiadamente
- [ ] Loading states en todas las llamadas

#### Módulos
- [x] Autenticación (login, register)
- [ ] Frutas (CRUD + slug + recetas)
- [ ] Usuarios (CRUD + roles + perfil)
- [ ] Recetas (CRUD completo)
- [ ] Regiones (CRUD + frutas)
- [ ] Frutas-Recetas (relaciones)
- [ ] Roles (gestión completa)
- [ ] Pasos de receta (CRUD)

#### Testing
- [ ] Login exitoso
- [ ] Login fallido
- [ ] Registro exitoso
- [ ] CRUD frutas completo
- [ ] CRUD usuarios completo
- [ ] Protección de rutas admin
- [ ] Manejo de token expirado

---

## 🎓 Conclusión

**Estado actual: 35% conectado (bugs incluidos)**
**Estado real funcionando: ~20%**

### Problemas principales:
1. 🔴 URLs inconsistentes (puerto 4000 vs 3000)
2. 🔴 Endpoint `/user` incorrecto
3. 🟠 70% de endpoints backend sin usar
4. 🟠 Sin módulos de Recetas y Regiones

### Próximos pasos inmediatos:
1. Corregir bugs críticos (1 hora)
2. Completar servicios básicos (1 semana)
3. Implementar módulos faltantes (1 mes)

### Tiempo estimado para 100%:
- Correcciones: 1 hora
- Features básicas: 1 semana
- Módulos completos: 4-6 semanas
- Testing: 1 semana

**Total: ~2 meses de trabajo**

---

**Última actualización:** 19 de noviembre de 2025
**Autor:** Claude AI
**Versión:** 1.0
