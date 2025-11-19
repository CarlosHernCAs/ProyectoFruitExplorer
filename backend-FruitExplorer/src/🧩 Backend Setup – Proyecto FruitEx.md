🧩 Backend Setup – Proyecto FruitExplorer
📘 Descripción general

Este backend gestiona la API REST para el sistema FruitExplorer.
Permite la administración de frutas, recetas, regiones, usuarios, roles y modelos de IA.
Está desarrollado con Node.js, Express, y documentado con Scalar.
Usa MySQL (XAMPP) como base de datos.

🧱 Tecnologías principales

Node.js 20+

Express.js

Scalar (@scalar/express-api-reference)

JWT (Autenticación)

bcrypt (Hash de contraseñas)

MySQL2

Nodemon (entorno de desarrollo)

⚙️ Variables de entorno (.env)

Archivo .env ubicado en la raíz del backend:

PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fruitexplorer_db
JWT_SECRET=clave_super_secreta

🗂️ Estructura del proyecto
backend-FruitExplorer/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   ├── utils/
│   │   └── hash.js
│   ├── docs/
│   │   └── openapi.js
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
├── README.md
└── backend-setup.md

💾 Configuración de base de datos

Base de datos: fruitexplorer_db

Tablas principales

users

roles

user_roles

fruits

recipes

recipe_steps

regions

fruit_recipes

fruit_regions

ml_models

queries

contributions

system_logs

👤 Tabla users
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  display_name VARCHAR(255),
  preferences JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  consent_tracking BOOLEAN DEFAULT 0,
  location_permission BOOLEAN DEFAULT 0
);

🔐 Tabla roles y user_roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE
);

CREATE TABLE user_roles (
  user_id CHAR(36),
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);


Roles base:

INSERT INTO roles (name) VALUES ('admin'), ('user');

🧠 Lógica de roles y autenticación
Flujo general

Un usuario se registra → se le asigna automáticamente el rol user.

Si no existen roles base (admin, user), el sistema los crea automáticamente.

Solo los usuarios con rol admin acceden a rutas restringidas (como /users).

La autenticación usa JWT.

🔑 Endpoints principales
🔸 Autenticación (/api/auth)
Método	Ruta	Descripción
POST	/api/auth/register	Registrar nuevo usuario
POST	/api/auth/login	Iniciar sesión

Ejemplo de respuesta:

{
  "mensaje": "Usuario registrado correctamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "uuid",
    "email": "905953@senati.pe",
    "display_name": "carlos"
  }
}

🔸 Usuarios (/api/users)
Método	Ruta	Permiso	Descripción
GET	/api/users	admin	Listar todos los usuarios
GET	/api/users/:id	user/admin	Obtener usuario por ID
PUT	/api/users/update	user/admin	Actualizar perfil
DELETE	/api/users/:id	admin	Eliminar usuario
POST	/api/users/assign-role	admin	Asignar rol
POST	/api/users/remove-role	admin	Quitar rol
🧩 Middlewares
auth.middleware.js

Valida el token JWT:

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

role.middleware.js

Verifica si el usuario tiene un rol:

export const requireRole = (roleName) => async (req, res, next) => {
  const [rows] = await pool.query(`
    SELECT r.name FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = ? AND r.name = ?
  `, [req.user.id, roleName]);

  if (rows.length === 0) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  next();
};

📦 Ejemplo .env configurado para XAMPP (MySQL)
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fruitexplorer_db
JWT_SECRET=clave_super_secreta

🚀 Ejecución del servidor
npm run dev


Salida esperada:

Servidor escuchando en puerto 4000
Conectado a MySQL con éxito

🧠 Compatibilidad con Android (Java)

Todas las respuestas son JSON plano.

Android puede usar Retrofit o HttpURLConnection.

Autenticación: enviar header

Authorization: Bearer <token>


Ejemplo:

conn.setRequestProperty("Authorization", "Bearer " + token);

🧰 Documentación API (Scalar)

Acceso en navegador:

http://localhost:4000/api/docs


Scalar muestra todos los endpoints con ejemplos y parámetros.

✅ Checklist de seguridad

JWT con expiración de 1 hora.

CORS habilitado para React y Android.

Contraseñas cifradas con bcrypt.

Queries parametrizadas (evita inyección SQL).

Roles validados en cada endpoint protegido.

🪪 Créditos del desarrollo

Desarrollador: Carlos Antonio Hernández Castro

Backend stack: Node.js + Express + MySQL + Scalar

Base de datos: XAMPP / phpMyAdmin

Lenguaje móvil: Java (Android)

Frontend: React + Vite