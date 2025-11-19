import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Cargar variables de entorno
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function verificarRoles() {
  try {
    console.log('\n🔍 VERIFICANDO SISTEMA DE ROLES\n');
    console.log('='.repeat(60));

    // 1. Verificar que existan los roles
    console.log('\n1️⃣ ROLES EN LA BASE DE DATOS:');
    const [roles] = await pool.query('SELECT * FROM roles');

    if (roles.length === 0) {
      console.log('❌ No hay roles en la base de datos. Creando roles...');
      await pool.query("INSERT INTO roles (name) VALUES ('admin'), ('user')");
      console.log('✅ Roles creados: admin, user');
    } else {
      console.table(roles);
    }

    // 2. Ver usuarios con sus roles
    console.log('\n2️⃣ USUARIOS Y SUS ROLES:');
    const [usersWithRoles] = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.display_name,
        r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.email
    `);

    console.table(usersWithRoles);

    // 3. Encontrar usuarios sin rol
    console.log('\n3️⃣ USUARIOS SIN ROL ASIGNADO:');
    const [usersWithoutRole] = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.display_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.user_id IS NULL
    `);

    if (usersWithoutRole.length > 0) {
      console.log('⚠️ Los siguientes usuarios NO tienen rol asignado:');
      console.table(usersWithoutRole);

      // Asignar rol 'user' por defecto a todos los usuarios sin rol
      console.log('\n📝 Asignando rol "user" a usuarios sin rol...');

      for (const user of usersWithoutRole) {
        const [roleUser] = await pool.query('SELECT id FROM roles WHERE name = ?', ['user']);
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [user.id, roleUser[0].id]
        );
        console.log(`✅ Rol "user" asignado a: ${user.email}`);
      }

      console.log('\n✅ Todos los usuarios ahora tienen rol asignado');
    } else {
      console.log('✅ Todos los usuarios tienen rol asignado');
    }

    // 4. Mostrar resultado final
    console.log('\n4️⃣ RESULTADO FINAL - TODOS LOS USUARIOS CON ROLES:');
    const [finalUsers] = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.display_name,
        r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY r.name DESC, u.email
    `);

    console.table(finalUsers);

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 INSTRUCCIONES:');
    console.log('\nPara cambiar un usuario a ADMIN, ejecuta en MySQL:');
    console.log('\n  UPDATE user_roles ur');
    console.log('  JOIN users u ON ur.user_id = u.id');
    console.log('  JOIN roles r ON r.name = \'admin\'');
    console.log('  SET ur.role_id = r.id');
    console.log('  WHERE u.email = \'TU_EMAIL_AQUI@example.com\';');
    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarRoles();
