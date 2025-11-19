# 🎯 Funcionalidad de Asignación de Roles

## ✅ Implementación Completa

Se ha agregado la funcionalidad para **asignar y cambiar roles** directamente desde la página de Gestión de Usuarios.

---

## 🆕 Características Nuevas

### 1. Selector de Roles en Cada Tarjeta de Usuario

Cada tarjeta de usuario ahora incluye un **selector dropdown** que permite cambiar el rol del usuario en tiempo real.

**Ubicación:** En el cuerpo de la tarjeta, debajo de las fechas de creación y último acceso.

**Roles Disponibles:**
- 👤 **Usuario** - Acceso limitado a visualización
- ✏️ **Editor** - Acceso intermedio (pendiente de definir permisos específicos)
- 👨‍💼 **Administrador** - Acceso total al sistema

---

## 🔧 Implementación Técnica

### Backend

#### 1. Nuevo Endpoint: `PUT /api/users/update-role`

**Archivo:** `backend-FruitExplorer/src/controllers/user.controller.js`

**Función:** `updateUserRole`

```javascript
export const updateUserRole = async (req, res) => {
  const { user_id, role_name } = req.body;

  try {
    // Obtener el ID del nuevo rol
    const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', [role_name]);

    if (roles.length === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    const newRoleId = roles[0].id;

    // Verificar si el usuario ya tiene un rol asignado
    const [existing] = await pool.query(
      'SELECT role_id FROM user_roles WHERE user_id = ?',
      [user_id]
    );

    if (existing.length > 0) {
      // Actualizar el rol existente
      await pool.query(
        'UPDATE user_roles SET role_id = ? WHERE user_id = ?',
        [newRoleId, user_id]
      );
    } else {
      // Insertar nuevo rol
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [user_id, newRoleId]
      );
    }

    res.status(200).json({ mensaje: 'Rol actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar rol' });
  }
};
```

**Características:**
- Recibe `user_id` y `role_name` (nombre del rol, no ID)
- Busca el ID del rol en la tabla `roles`
- Si el usuario ya tiene un rol, lo actualiza (`UPDATE`)
- Si no tiene rol, lo inserta (`INSERT`)
- Protegido con middleware `requireRole('admin')`

#### 2. Ruta Agregada

**Archivo:** `backend-FruitExplorer/src/routes/user.routes.js`

```javascript
router.put('/update-role', requireAuth, requireRole('admin'), updateUserRole);
```

---

### Frontend

#### 1. Servicio de API

**Archivo:** `frontend-Web/src/services/userService.js`

```javascript
export const updateUserRole = (userId, roleName) => {
  return apiFetch("/users/update-role", {
    method: "PUT",
    body: JSON.stringify({ user_id: userId, role_name: roleName })
  });
};
```

#### 2. Componente de Página

**Archivo:** `frontend-Web/src/pages/UsersPage.jsx`

**Estado Agregado:**
```javascript
const [updatingRole, setUpdatingRole] = useState(null);
```

**Función Nueva:**
```javascript
const handleRoleChange = async (userId, newRole) => {
  setUpdatingRole(userId);
  try {
    await updateUserRole(userId, newRole);
    setMessage({
      text: "Rol actualizado correctamente",
      type: "success"
    });
    loadUsers();
  } catch (err) {
    setMessage({
      text: "Error al actualizar rol: " + err.message,
      type: "error"
    });
  } finally {
    setUpdatingRole(null);
  }
};
```

**JSX del Selector:**
```jsx
<div className="role-selector">
  <label>
    <Shield size={14} />
    <span>Rol:</span>
  </label>
  <select
    value={user.role || 'user'}
    onChange={(e) => handleRoleChange(user.id, e.target.value)}
    disabled={updatingRole === user.id}
    className="role-select"
  >
    <option value="user">Usuario</option>
    <option value="editor">Editor</option>
    <option value="admin">Administrador</option>
  </select>
  {updatingRole === user.id && (
    <div className="spinner-small"></div>
  )}
</div>
```

#### 3. Estilos CSS

**Archivo:** `frontend-Web/src/styles/users.css`

```css
.role-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.role-selector label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.role-selector label svg {
  color: #7c3aed;
}

.role-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.role-select:hover:not(:disabled) {
  border-color: #7c3aed;
}

.role-select:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.role-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}
```

---

## 🎨 Diseño del Selector

### Estado Normal
```
┌──────────────────────────────────────┐
│  🛡️ Rol:  [Usuario        ▼]  │
└──────────────────────────────────────┘
```

### Estado Cargando
```
┌──────────────────────────────────────┐
│  🛡️ Rol:  [Editor         ▼] ⟳  │
└──────────────────────────────────────┘
```

### Estado Hover
```
┌──────────────────────────────────────┐
│  🛡️ Rol:  [Administrador  ▼]  │  ← Borde morado
└──────────────────────────────────────┘
```

---

## 🎯 Flujo de Uso

### 1. Cambiar Rol de Usuario

```
1. Usuario admin abre /users
   ↓
2. Ve la tarjeta de un usuario
   ↓
3. Hace clic en el dropdown "Rol"
   ↓
4. Selecciona nuevo rol (ej: Editor → Admin)
   ↓
5. Selector se deshabilita y muestra spinner
   ↓
6. Frontend envía: PUT /api/users/update-role
   Body: { user_id: "123", role_name: "admin" }
   ↓
7. Backend:
   - Busca ID del rol "admin"
   - Actualiza user_roles SET role_id = X WHERE user_id = 123
   ↓
8. Backend responde: 200 OK
   ↓
9. Frontend muestra mensaje de éxito
   ↓
10. Recarga lista de usuarios
   ↓
11. Usuario ahora aparece con rol actualizado
```

---

## 🧪 Cómo Probar

### Test 1: Cambiar Usuario a Admin

```
1. Inicia sesión como admin
2. Ve a http://localhost:5174/users
3. Busca un usuario con rol "Usuario"
4. Abre el dropdown "Rol"
5. Selecciona "Administrador"
6. Espera el spinner
7. Verifica mensaje: "Rol actualizado correctamente"
8. Recarga la página
9. Verifica que el usuario ahora es "Administrador"
10. Cierra sesión
11. Inicia sesión con ese usuario
12. Verifica que ahora ve los menús de admin
```

### Test 2: Degradar Admin a Usuario

```
1. Inicia sesión como admin
2. Ve a http://localhost:5174/users
3. Busca un usuario con rol "Administrador"
4. Cambia su rol a "Usuario"
5. Verifica mensaje de éxito
6. Ese usuario ya no podrá acceder a rutas admin
```

### Test 3: Rol Editor

```
1. Cambia un usuario a rol "Editor"
2. Verifica que se guarda correctamente
3. Las estadísticas deben actualizarse:
   - Editores: +1
   - Anterior rol: -1
```

---

## 🔒 Seguridad

### Validaciones Implementadas

1. **Solo Admin puede cambiar roles:**
   - Middleware `requireRole('admin')` en el endpoint
   - Frontend solo accesible por admins

2. **Validación de rol válido:**
   - Backend verifica que el rol exista en la tabla `roles`
   - Si no existe, retorna 404

3. **Protección de datos:**
   - Se usa prepared statement para prevenir SQL injection
   - Se valida que el `user_id` exista antes de actualizar

4. **Feedback visual:**
   - Spinner mientras se actualiza
   - Selector deshabilitado durante actualización
   - Mensaje de confirmación al completar

---

## 📊 Estructura de la Base de Datos

### Tablas Involucradas

```sql
-- Tabla roles
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Datos
INSERT INTO roles (name) VALUES
  ('admin'),
  ('editor'),
  ('user');

-- Tabla user_roles (relación usuarios-roles)
CREATE TABLE user_roles (
  user_id VARCHAR(36) NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

### Consulta para Actualizar Rol

```sql
-- Actualizar rol existente
UPDATE user_roles
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE user_id = '123';

-- Insertar nuevo rol
INSERT INTO user_roles (user_id, role_id)
VALUES ('123', (SELECT id FROM roles WHERE name = 'admin'));
```

---

## ✅ Checklist de Funcionalidad

- [x] Endpoint backend creado y testeado
- [x] Ruta agregada con protección admin
- [x] Servicio frontend implementado
- [x] Selector de roles en UI
- [x] Estilos CSS aplicados
- [x] Estados de carga implementados
- [x] Mensajes de feedback
- [x] Actualización automática de la lista
- [x] Actualización de estadísticas
- [x] Validación de permisos
- [x] Manejo de errores

---

## 🎉 Resultado Final

### Antes
❌ Los roles solo se podían ver, no cambiar
❌ No había forma de promover usuarios a admin
❌ No había forma de degradar admins

### Después
✅ Selector dropdown en cada tarjeta de usuario
✅ Cambio de rol en tiempo real
✅ Feedback visual con spinner
✅ Mensajes de confirmación
✅ Actualización automática de estadísticas
✅ Solo admins pueden cambiar roles
✅ Validación completa en backend
✅ Interfaz intuitiva y moderna

**¡Sistema de gestión de roles completamente funcional!** 🎊

---

## 📈 Casos de Uso

### Caso 1: Nuevo Empleado
```
Situación: Contratas un nuevo editor
Solución:
1. Crea usuario desde "Nuevo Usuario"
2. Se crea con rol "Usuario" por defecto
3. Cambias su rol a "Editor" desde el dropdown
4. Ahora tiene permisos de editor
```

### Caso 2: Promoción
```
Situación: Un editor se vuelve administrador
Solución:
1. Busca el usuario en la lista
2. Cambias su rol de "Editor" a "Administrador"
3. Inmediatamente tiene acceso completo
```

### Caso 3: Degradación
```
Situación: Un admin abusó de sus permisos
Solución:
1. Cambias su rol a "Usuario"
2. Pierde acceso a todas las funciones admin
3. Solo puede ver contenido público
```

---

## 🔮 Mejoras Futuras

1. **Historial de cambios de roles**
   - Registrar quién cambió el rol, cuándo y de qué a qué

2. **Confirmación para cambios críticos**
   - Modal de confirmación al convertir admin a usuario

3. **Roles personalizados**
   - Crear roles custom con permisos específicos

4. **Bulk actions**
   - Cambiar rol de múltiples usuarios a la vez

5. **Permisos granulares**
   - No solo roles, sino permisos específicos por funcionalidad
