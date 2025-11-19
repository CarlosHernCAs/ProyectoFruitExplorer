/**
 * 🌱 Script de Seed Database - FruitExplorer
 * ==========================================
 * Este script carga datos de ejemplo en la base de datos.
 * Ejecutar: node seedDatabase.js
 */

import pool from './src/config/db.js';
import { hashPassword } from './src/utils/hash.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==========================================
// Función principal de seeding
// ==========================================
async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('\n🌱 Iniciando seed de la base de datos...\n');

    // Desactivar foreign key checks temporalmente
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // ==========================================
    // 1. Limpiar tablas existentes
    // ==========================================
    console.log('🧹 Limpiando tablas existentes...');

    await connection.query('TRUNCATE TABLE fruit_recipes');
    await connection.query('TRUNCATE TABLE fruit_regions');
    await connection.query('TRUNCATE TABLE recipe_steps');
    await connection.query('TRUNCATE TABLE recipes');
    await connection.query('TRUNCATE TABLE fruits');
    await connection.query('TRUNCATE TABLE regions');
    await connection.query('TRUNCATE TABLE user_roles');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE roles');

    console.log('✅ Tablas limpiadas correctamente\n');

    // ==========================================
    // 2. ROLES
    // ==========================================
    console.log('📝 Insertando roles...');

    await connection.query(`
      INSERT INTO roles (id, name) VALUES
      (1, 'admin'),
      (2, 'user'),
      (3, 'editor')
    `);

    console.log('✅ 3 roles insertados\n');

    // ==========================================
    // 3. USUARIOS (con contraseñas hasheadas)
    // ==========================================
    console.log('👥 Insertando usuarios...');

    const passwordHash = await hashPassword('password123');

    await connection.query(`
      INSERT INTO users (id, email, display_name, password_hash, created_at, last_login) VALUES
      (1, 'admin@fruitexplorer.com', 'Administrador', ?, NOW(), NOW()),
      (2, 'editor@fruitexplorer.com', 'Editor Principal', ?, NOW(), NOW()),
      (3, 'usuario@fruitexplorer.com', 'Usuario Test', ?, NOW(), NULL),
      (4, 'carlos@fruitexplorer.com', 'Carlos Hernández', ?, NOW(), NOW()),
      (5, 'diego@fruitexplorer.com', 'Diego García', ?, NOW(), NOW())
    `, [passwordHash, passwordHash, passwordHash, passwordHash, passwordHash]);

    console.log('✅ 5 usuarios insertados (password: password123)\n');

    // ==========================================
    // 4. ASIGNACIÓN DE ROLES
    // ==========================================
    console.log('🔐 Asignando roles a usuarios...');

    await connection.query(`
      INSERT INTO user_roles (user_id, role_id) VALUES
      (1, 1), (2, 3), (3, 2), (4, 1), (5, 3)
    `);

    console.log('✅ 5 roles asignados\n');

    // ==========================================
    // 5. REGIONES
    // ==========================================
    console.log('🌍 Insertando regiones...');

    const regions = [
      [1, 'América del Sur', 'Región tropical y subtropical rica en biodiversidad frutal', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600'],
      [2, 'Centroamérica', 'Región de clima tropical con gran variedad de frutas exóticas', 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600'],
      [3, 'Sudeste Asiático', 'Hogar de algunas de las frutas más exóticas del mundo', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600'],
      [4, 'Mediterráneo', 'Región de clima templado con frutas cítricas y de hueso', 'https://images.unsplash.com/photo-1464500542832-2ea1e1b59b1a?w=600'],
      [5, 'África Tropical', 'Rica en frutas nativas y tradicionales africanas', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600'],
      [6, 'Caribe', 'Frutas tropicales del mar Caribe y sus islas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600']
    ];

    for (const region of regions) {
      await connection.query(
        'INSERT INTO regions (id, name, description, image_url) VALUES (?, ?, ?, ?)',
        region
      );
    }

    console.log('✅ 6 regiones insertadas\n');

    // ==========================================
    // 6. FRUTAS
    // ==========================================
    console.log('🍎 Insertando frutas...');

    const fruits = [
      {
        id: 1, slug: 'mango', common_name: 'Mango', scientific_name: 'Mangifera indica',
        description: 'El mango es una fruta tropical jugosa y dulce, originaria del sur de Asia. Es rico en vitaminas A y C, y contiene antioxidantes beneficiosos para la salud. Su pulpa dorada es versátil en la cocina.',
        nutritional: JSON.stringify({calories: 60, carbs: "15g", fiber: "1.6g", sugar: "13.7g", protein: "0.8g", vitaminC: "36.4mg", vitaminA: "54mcg"}),
        image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/mango'
      },
      {
        id: 2, slug: 'banana', common_name: 'Banana', scientific_name: 'Musa acuminata',
        description: 'La banana es una de las frutas más populares del mundo. Rica en potasio y carbohidratos, es perfecta para obtener energía rápida. Su sabor dulce y textura cremosa la hacen ideal para batidos y postres.',
        nutritional: JSON.stringify({calories: 89, carbs: "23g", fiber: "2.6g", sugar: "12.2g", protein: "1.1g", potassium: "358mg", vitaminB6: "0.4mg"}),
        image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/banana'
      },
      {
        id: 3, slug: 'papaya', common_name: 'Papaya', scientific_name: 'Carica papaya',
        description: 'La papaya es una fruta tropical de pulpa anaranjada y sabor dulce. Contiene papaína, una enzima que ayuda a la digestión. Es rica en vitamina C, folato y antioxidantes.',
        nutritional: JSON.stringify({calories: 43, carbs: "11g", fiber: "1.7g", sugar: "7.8g", protein: "0.5g", vitaminC: "60.9mg", folate: "37mcg"}),
        image_url: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/papaya'
      },
      {
        id: 4, slug: 'pineapple', common_name: 'Piña', scientific_name: 'Ananas comosus',
        description: 'La piña es una fruta tropical con sabor agridulce refrescante. Contiene bromelina, una enzima con propiedades antiinflamatorias. Excelente fuente de vitamina C y manganeso.',
        nutritional: JSON.stringify({calories: 50, carbs: "13.1g", fiber: "1.4g", sugar: "9.9g", protein: "0.5g", vitaminC: "47.8mg", manganese: "0.9mg"}),
        image_url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/pineapple'
      },
      {
        id: 5, slug: 'strawberry', common_name: 'Fresa', scientific_name: 'Fragaria × ananassa',
        description: 'La fresa es una fruta pequeña, roja y jugosa con un sabor dulce-ácido característico. Rica en vitamina C y antioxidantes, especialmente antocianinas que le dan su color rojo.',
        nutritional: JSON.stringify({calories: 32, carbs: "7.7g", fiber: "2g", sugar: "4.9g", protein: "0.7g", vitaminC: "58.8mg", folate: "24mcg"}),
        image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/strawberry'
      },
      {
        id: 6, slug: 'watermelon', common_name: 'Sandía', scientific_name: 'Citrullus lanatus',
        description: 'La sandía es una fruta grande y refrescante con alto contenido de agua (92%). Perfecta para hidratarse en días calurosos. Contiene licopeno, un potente antioxidante.',
        nutritional: JSON.stringify({calories: 30, carbs: "7.6g", fiber: "0.4g", sugar: "6.2g", protein: "0.6g", vitaminC: "8.1mg", lycopene: "4532mcg"}),
        image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/watermelon'
      },
      {
        id: 7, slug: 'orange', common_name: 'Naranja', scientific_name: 'Citrus × sinensis',
        description: 'La naranja es la fruta cítrica más popular del mundo. Famosa por su alto contenido de vitamina C, es jugosa, dulce y ligeramente ácida. Excelente para el sistema inmunológico.',
        nutritional: JSON.stringify({calories: 47, carbs: "11.8g", fiber: "2.4g", sugar: "9.4g", protein: "0.9g", vitaminC: "53.2mg", folate: "30mcg"}),
        image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/orange'
      },
      {
        id: 8, slug: 'avocado', common_name: 'Aguacate', scientific_name: 'Persea americana',
        description: 'El aguacate es único por su alto contenido de grasas saludables (monoinsaturadas). Cremoso y nutritivo, es rico en potasio, vitamina E y fibra. Excelente para ensaladas y guacamole.',
        nutritional: JSON.stringify({calories: 160, carbs: "8.5g", fiber: "6.7g", sugar: "0.7g", protein: "2g", fat: "14.7g", potassium: "485mg", vitaminE: "2.1mg"}),
        image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/avocado'
      },
      {
        id: 9, slug: 'kiwi', common_name: 'Kiwi', scientific_name: 'Actinidia deliciosa',
        description: 'El kiwi es una fruta pequeña de pulpa verde brillante y sabor agridulce refrescante. Contiene más vitamina C que una naranja. Rico en fibra y actinidina, una enzima que ayuda a la digestión.',
        nutritional: JSON.stringify({calories: 61, carbs: "14.7g", fiber: "3g", sugar: "9g", protein: "1.1g", vitaminC: "92.7mg", vitaminK: "40.3mcg"}),
        image_url: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=600',
        source_api_url: 'https://fruityvice.com/api/fruit/kiwi'
      },
      {
        id: 10, slug: 'dragon-fruit', common_name: 'Pitaya', scientific_name: 'Hylocereus undatus',
        description: 'La pitaya o fruta del dragón es exótica y visualmente impactante. Su pulpa blanca con semillas negras tiene un sabor suave y refrescante. Rica en antioxidantes y prebióticos.',
        nutritional: JSON.stringify({calories: 60, carbs: "13g", fiber: "3g", sugar: "9g", protein: "1.2g", vitaminC: "9mg", iron: "1.9mg"}),
        image_url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=600',
        source_api_url: null
      },
      {
        id: 11, slug: 'coconut', common_name: 'Coco', scientific_name: 'Cocos nucifera',
        description: 'El coco es una fruta tropical versátil. Su agua es hidratante natural, su pulpa es rica en grasas saturadas saludables. Se usa en cocina asiática, postres y bebidas.',
        nutritional: JSON.stringify({calories: 354, carbs: "15.2g", fiber: "9g", sugar: "6.2g", protein: "3.3g", fat: "33.5g", iron: "2.4mg"}),
        image_url: 'https://images.unsplash.com/photo-1589881133595-f6e8e1f8f0e5?w=600',
        source_api_url: null
      },
      {
        id: 12, slug: 'passion-fruit', common_name: 'Maracuyá', scientific_name: 'Passiflora edulis',
        description: 'El maracuyá es una fruta aromática de sabor intenso agridulce. Su pulpa gelatinosa con semillas es rica en vitamina A, C y antioxidantes. Ideal para jugos y postres.',
        nutritional: JSON.stringify({calories: 97, carbs: "23.4g", fiber: "10.4g", sugar: "11.2g", protein: "2.2g", vitaminC: "30mg", vitaminA: "1274IU"}),
        image_url: 'https://images.unsplash.com/photo-1612892438462-f3e8ac0b7d4a?w=600',
        source_api_url: null
      }
    ];

    for (const fruit of fruits) {
      await connection.query(
        `INSERT INTO fruits (id, slug, common_name, scientific_name, description, nutritional, image_url, source_api_url, last_synced_at, synced_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1, NOW())`,
        [fruit.id, fruit.slug, fruit.common_name, fruit.scientific_name, fruit.description, fruit.nutritional, fruit.image_url, fruit.source_api_url]
      );
    }

    console.log('✅ 12 frutas insertadas\n');

    // ==========================================
    // 7. RELACIÓN FRUTAS-REGIONES
    // ==========================================
    console.log('🗺️  Relacionando frutas con regiones...');

    const fruitRegions = [
      [1,1],[1,2],[1,3], // Mango
      [2,1],[2,2],[2,3],[2,6], // Banana
      [3,1],[3,2],[3,6], // Papaya
      [4,1],[4,2],[4,3],[4,6], // Piña
      [5,4], // Fresa
      [6,1],[6,4],[6,5], // Sandía
      [7,4],[7,1], // Naranja
      [8,1],[8,2], // Aguacate
      [9,3],[9,4], // Kiwi
      [10,1],[10,3], // Pitaya
      [11,1],[11,2],[11,3],[11,6], // Coco
      [12,1],[12,2] // Maracuyá
    ];

    for (const [fruitId, regionId] of fruitRegions) {
      await connection.query(
        'INSERT INTO fruit_regions (fruit_id, region_id) VALUES (?, ?)',
        [fruitId, regionId]
      );
    }

    console.log('✅ 29 relaciones frutas-regiones insertadas\n');

    // ==========================================
    // 8. RECETAS
    // ==========================================
    console.log('🍽️  Insertando recetas...');

    const recipes = [
      [1, 'Smoothie de Mango y Banana', 'Un batido tropical cremoso y nutritivo, perfecto para el desayuno o merienda. Combina la dulzura del mango con la cremosidad de la banana.', 'Receta original FruitExplorer', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600'],
      [2, 'Ensalada Tropical de Frutas', 'Una mezcla refrescante de frutas tropicales cortadas en cubos, perfecta para días calurosos. Incluye mango, piña, papaya y un toque de limón.', 'Chef Maria González', 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600'],
      [3, 'Guacamole Tradicional', 'La receta clásica mexicana de aguacate machacado con limón, cilantro, cebolla y tomate. Perfecto para tacos y nachos.', 'Receta Mexicana Tradicional', 'https://images.unsplash.com/photo-1580870069867-74c57ee60d19?w=600'],
      [4, 'Agua Fresca de Sandía', 'Bebida refrescante mexicana hecha con sandía natural, agua y un toque de limón. Perfecta para el verano.', 'Receta tradicional mexicana', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'],
      [5, 'Bowl de Açaí con Fresas', 'Desayuno energético con base de açaí, cubierto con fresas frescas, banana, granola y miel. Rico en antioxidantes.', 'Receta brasileña moderna', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600'],
      [6, 'Jugo de Naranja Natural', 'Jugo fresco recién exprimido de naranjas. Rico en vitamina C, perfecto para comenzar el día con energía.', 'Receta básica', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600'],
      [7, 'Smoothie Bowl de Pitaya', 'Bowl colorido con base de pitaya congelada, decorado con frutas frescas, coco rallado y semillas de chía.', 'Receta wellness', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600'],
      [8, 'Mousse de Maracuyá', 'Postre cremoso y ligero con el sabor intenso del maracuyá. Perfecto para ocasiones especiales.', 'Chef Patricia Rojas', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'],
      [9, 'Ensalada de Papaya Verde', 'Ensalada tailandesa picante con papaya verde rallada, tomates cherry, cacahuates y salsa de pescado.', 'Som Tam - Receta Tailandesa', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600'],
      [10, 'Helado de Coco Casero', 'Helado cremoso hecho con leche de coco, natural y sin lácteos. Refrescante y tropical.', 'Receta vegana', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'],
      [11, 'Tarta de Kiwi y Crema', 'Tarta elegante con base de galleta, crema pastelera y rodajas frescas de kiwi. Visualmente hermosa y deliciosa.', 'Repostería francesa adaptada', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600'],
      [12, 'Piña Colada Clásica', 'Cóctel tropical icónico con piña, coco y ron. Cremoso y refrescante, perfecto para la playa.', 'Receta caribeña clásica', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600']
    ];

    for (const recipe of recipes) {
      await connection.query(
        'INSERT INTO recipes (id, title, description, source, image_url) VALUES (?, ?, ?, ?, ?)',
        recipe
      );
    }

    console.log('✅ 12 recetas insertadas\n');

    // ==========================================
    // 9. PASOS DE RECETAS (solo algunas de ejemplo)
    // ==========================================
    console.log('📋 Insertando pasos de recetas...');

    // Smoothie de Mango y Banana
    const steps1 = [
      'Pela y corta 1 mango maduro en cubos',
      'Pela 2 bananas maduras y córtalas en rodajas',
      'Coloca el mango y las bananas en la licuadora',
      'Agrega 1 taza de leche (o leche vegetal) y 1/2 taza de yogurt natural',
      'Añade 1 cucharada de miel y hielo al gusto',
      'Licua todo hasta obtener una mezcla suave y cremosa',
      'Sirve inmediatamente en vasos fríos y decora con rodajas de fruta'
    ];

    for (let i = 0; i < steps1.length; i++) {
      await connection.query(
        'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES (?, ?, ?)',
        [1, i + 1, steps1[i]]
      );
    }

    // Guacamole
    const steps3 = [
      'Corta 3 aguacates maduros por la mitad y retira el hueso',
      'Saca la pulpa con una cuchara y colócala en un bowl',
      'Machaca los aguacates con un tenedor hasta obtener la textura deseada',
      'Pica finamente 1/2 cebolla, 1 tomate y un manojo de cilantro',
      'Agrega las verduras picadas al aguacate machacado',
      'Exprime el jugo de 1 limón y agrega sal al gusto',
      'Mezcla todo suavemente y sirve inmediatamente con totopos'
    ];

    for (let i = 0; i < steps3.length; i++) {
      await connection.query(
        'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES (?, ?, ?)',
        [3, i + 1, steps3[i]]
      );
    }

    // Jugo de Naranja
    const steps6 = [
      'Lava bien 6-8 naranjas frescas',
      'Corta las naranjas por la mitad',
      'Exprime cada mitad con un exprimidor manual o eléctrico',
      'Cuela el jugo si prefieres sin pulpa',
      'Sirve inmediatamente en vaso frío',
      'Opcional: añade hielo o endulza con miel al gusto'
    ];

    for (let i = 0; i < steps6.length; i++) {
      await connection.query(
        'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES (?, ?, ?)',
        [6, i + 1, steps6[i]]
      );
    }

    console.log('✅ 20 pasos de recetas insertados (ejemplos)\n');

    // ==========================================
    // 10. RELACIÓN FRUTAS-RECETAS
    // ==========================================
    console.log('🔗 Relacionando frutas con recetas...');

    const fruitRecipes = [
      [1, 1], [2, 1], // Smoothie: Mango, Banana
      [1, 2], [4, 2], [3, 2], // Ensalada Tropical: Mango, Piña, Papaya
      [8, 3], // Guacamole: Aguacate
      [6, 4], // Agua de Sandía: Sandía
      [5, 5], [2, 5], // Bowl Açaí: Fresa, Banana
      [7, 6], // Jugo: Naranja
      [10, 7], [9, 7], [5, 7], // Smoothie Bowl Pitaya: Pitaya, Kiwi, Fresa
      [12, 8], // Mousse: Maracuyá
      [3, 9], // Ensalada Papaya: Papaya
      [11, 10], // Helado: Coco
      [9, 11], // Tarta: Kiwi
      [4, 12], [11, 12] // Piña Colada: Piña, Coco
    ];

    for (const [fruitId, recipeId] of fruitRecipes) {
      await connection.query(
        'INSERT INTO fruit_recipes (fruit_id, recipe_id) VALUES (?, ?)',
        [fruitId, recipeId]
      );
    }

    console.log('✅ 19 relaciones frutas-recetas insertadas\n');

    // Reactivar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log('========================================');
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('========================================\n');

    console.log('📊 Resumen de datos insertados:');
    console.log('   - 3 roles');
    console.log('   - 5 usuarios (password: password123)');
    console.log('   - 5 asignaciones de roles');
    console.log('   - 6 regiones');
    console.log('   - 12 frutas');
    console.log('   - 29 relaciones frutas-regiones');
    console.log('   - 12 recetas');
    console.log('   - 20 pasos de recetas (ejemplos)');
    console.log('   - 19 relaciones frutas-recetas');
    console.log('\n========================================');
    console.log('🔐 Credenciales de prueba:');
    console.log('========================================');
    console.log('   Email: admin@fruitexplorer.com');
    console.log('   Password: password123');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

// ==========================================
// Ejecutar el script
// ==========================================
seedDatabase()
  .then(() => {
    console.log('🎉 Proceso completado. La base de datos está lista para usar.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
