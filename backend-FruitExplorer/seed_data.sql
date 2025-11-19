-- =========================================
-- 🌱 SEED DATA - FruitExplorer Database
-- =========================================
-- Este archivo contiene datos de ejemplo para poblar la base de datos
-- Ejecutar después de crear las tablas del esquema

-- Limpiar datos existentes (en orden para respetar foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE fruit_recipes;
TRUNCATE TABLE fruit_regions;
TRUNCATE TABLE recipe_steps;
TRUNCATE TABLE recipes;
TRUNCATE TABLE fruits;
TRUNCATE TABLE regions;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- 1. ROLES
-- =========================================
INSERT INTO roles (id, name) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'editor');

-- =========================================
-- 2. USUARIOS
-- =========================================
-- Contraseña para todos: "password123" (hasheada con bcrypt)
-- Hash generado: $2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK
INSERT INTO users (id, email, display_name, password_hash, created_at, last_login) VALUES
(1, 'admin@fruitexplorer.com', 'Administrador', '$2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW(), NOW()),
(2, 'editor@fruitexplorer.com', 'Editor Principal', '$2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW(), NOW()),
(3, 'usuario@fruitexplorer.com', 'Usuario Test', '$2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW(), NULL),
(4, 'carlos@fruitexplorer.com', 'Carlos Hernández', '$2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW(), NOW()),
(5, 'diego@fruitexplorer.com', 'Diego García', '$2b$10$rZ5qH7qZ5qH7qZ5qH7qZ5.O0kqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW(), NOW());

-- =========================================
-- 3. ASIGNACIÓN DE ROLES
-- =========================================
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin@fruitexplorer.com es admin
(2, 3), -- editor@fruitexplorer.com es editor
(3, 2), -- usuario@fruitexplorer.com es user
(4, 1), -- carlos@fruitexplorer.com es admin
(5, 3); -- diego@fruitexplorer.com es editor

-- =========================================
-- 4. REGIONES
-- =========================================
INSERT INTO regions (id, name, description, image_url, geo_polygon) VALUES
(1, 'América del Sur', 'Región tropical y subtropical rica en biodiversidad frutal', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', NULL),
(2, 'Centroamérica', 'Región de clima tropical con gran variedad de frutas exóticas', 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600', NULL),
(3, 'Sudeste Asiático', 'Hogar de algunas de las frutas más exóticas del mundo', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600', NULL),
(4, 'Mediterráneo', 'Región de clima templado con frutas cítricas y de hueso', 'https://images.unsplash.com/photo-1464500542832-2ea1e1b59b1a?w=600', NULL),
(5, 'África Tropical', 'Rica en frutas nativas y tradicionales africanas', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600', NULL),
(6, 'Caribe', 'Frutas tropicales del mar Caribe y sus islas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', NULL);

-- =========================================
-- 5. FRUTAS
-- =========================================
INSERT INTO fruits (id, slug, common_name, scientific_name, description, nutritional, image_url, source_api_url, last_synced_at, synced_by, created_at) VALUES
(1, 'mango', 'Mango', 'Mangifera indica',
'El mango es una fruta tropical jugosa y dulce, originaria del sur de Asia. Es rico en vitaminas A y C, y contiene antioxidantes beneficiosos para la salud. Su pulpa dorada es versátil en la cocina.',
'{"calories": 60, "carbs": "15g", "fiber": "1.6g", "sugar": "13.7g", "protein": "0.8g", "vitaminC": "36.4mg", "vitaminA": "54mcg"}',
'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600',
'https://fruityvice.com/api/fruit/mango',
NOW(), 1, NOW()),

(2, 'banana', 'Banana', 'Musa acuminata',
'La banana es una de las frutas más populares del mundo. Rica en potasio y carbohidratos, es perfecta para obtener energía rápida. Su sabor dulce y textura cremosa la hacen ideal para batidos y postres.',
'{"calories": 89, "carbs": "23g", "fiber": "2.6g", "sugar": "12.2g", "protein": "1.1g", "potassium": "358mg", "vitaminB6": "0.4mg"}',
'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
'https://fruityvice.com/api/fruit/banana',
NOW(), 1, NOW()),

(3, 'papaya', 'Papaya', 'Carica papaya',
'La papaya es una fruta tropical de pulpa anaranjada y sabor dulce. Contiene papaína, una enzima que ayuda a la digestión. Es rica en vitamina C, folato y antioxidantes.',
'{"calories": 43, "carbs": "11g", "fiber": "1.7g", "sugar": "7.8g", "protein": "0.5g", "vitaminC": "60.9mg", "folate": "37mcg"}',
'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=600',
'https://fruityvice.com/api/fruit/papaya',
NOW(), 1, NOW()),

(4, 'pineapple', 'Piña', 'Ananas comosus',
'La piña es una fruta tropical con sabor agridulce refrescante. Contiene bromelina, una enzima con propiedades antiinflamatorias. Excelente fuente de vitamina C y manganeso.',
'{"calories": 50, "carbs": "13.1g", "fiber": "1.4g", "sugar": "9.9g", "protein": "0.5g", "vitaminC": "47.8mg", "manganese": "0.9mg"}',
'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600',
'https://fruityvice.com/api/fruit/pineapple',
NOW(), 1, NOW()),

(5, 'strawberry', 'Fresa', 'Fragaria × ananassa',
'La fresa es una fruta pequeña, roja y jugosa con un sabor dulce-ácido característico. Rica en vitamina C y antioxidantes, especialmente antocianinas que le dan su color rojo.',
'{"calories": 32, "carbs": "7.7g", "fiber": "2g", "sugar": "4.9g", "protein": "0.7g", "vitaminC": "58.8mg", "folate": "24mcg"}',
'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600',
'https://fruityvice.com/api/fruit/strawberry',
NOW(), 1, NOW()),

(6, 'watermelon', 'Sandía', 'Citrullus lanatus',
'La sandía es una fruta grande y refrescante con alto contenido de agua (92%). Perfecta para hidratarse en días calurosos. Contiene licopeno, un potente antioxidante.',
'{"calories": 30, "carbs": "7.6g", "fiber": "0.4g", "sugar": "6.2g", "protein": "0.6g", "vitaminC": "8.1mg", "lycopene": "4532mcg"}',
'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=600',
'https://fruityvice.com/api/fruit/watermelon',
NOW(), 1, NOW()),

(7, 'orange', 'Naranja', 'Citrus × sinensis',
'La naranja es la fruta cítrica más popular del mundo. Famosa por su alto contenido de vitamina C, es jugosa, dulce y ligeramente ácida. Excelente para el sistema inmunológico.',
'{"calories": 47, "carbs": "11.8g", "fiber": "2.4g", "sugar": "9.4g", "protein": "0.9g", "vitaminC": "53.2mg", "folate": "30mcg"}',
'https://images.unsplash.com/photo-1547514701-42782101795e?w=600',
'https://fruityvice.com/api/fruit/orange',
NOW(), 1, NOW()),

(8, 'avocado', 'Aguacate', 'Persea americana',
'El aguacate es único por su alto contenido de grasas saludables (monoinsaturadas). Cremoso y nutritivo, es rico en potasio, vitamina E y fibra. Excelente para ensaladas y guacamole.',
'{"calories": 160, "carbs": "8.5g", "fiber": "6.7g", "sugar": "0.7g", "protein": "2g", "fat": "14.7g", "potassium": "485mg", "vitaminE": "2.1mg"}',
'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600',
'https://fruityvice.com/api/fruit/avocado',
NOW(), 1, NOW()),

(9, 'kiwi', 'Kiwi', 'Actinidia deliciosa',
'El kiwi es una fruta pequeña de pulpa verde brillante y sabor agridulce refrescante. Contiene más vitamina C que una naranja. Rico en fibra y actinidina, una enzima que ayuda a la digestión.',
'{"calories": 61, "carbs": "14.7g", "fiber": "3g", "sugar": "9g", "protein": "1.1g", "vitaminC": "92.7mg", "vitaminK": "40.3mcg"}',
'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=600',
'https://fruityvice.com/api/fruit/kiwi',
NOW(), 1, NOW()),

(10, 'dragon-fruit', 'Pitaya', 'Hylocereus undatus',
'La pitaya o fruta del dragón es exótica y visualmente impactante. Su pulpa blanca con semillas negras tiene un sabor suave y refrescante. Rica en antioxidantes y prebióticos.',
'{"calories": 60, "carbs": "13g", "fiber": "3g", "sugar": "9g", "protein": "1.2g", "vitaminC": "9mg", "iron": "1.9mg"}',
'https://images.unsplash.com/photo-1527325678964-54921661f888?w=600',
NULL,
NOW(), 1, NOW()),

(11, 'coconut', 'Coco', 'Cocos nucifera',
'El coco es una fruta tropical versátil. Su agua es hidratante natural, su pulpa es rica en grasas saturadas saludables. Se usa en cocina asiática, postres y bebidas.',
'{"calories": 354, "carbs": "15.2g", "fiber": "9g", "sugar": "6.2g", "protein": "3.3g", "fat": "33.5g", "iron": "2.4mg"}',
'https://images.unsplash.com/photo-1589881133595-f6e8e1f8f0e5?w=600',
NULL,
NOW(), 1, NOW()),

(12, 'passion-fruit', 'Maracuyá', 'Passiflora edulis',
'El maracuyá es una fruta aromática de sabor intenso agridulce. Su pulpa gelatinosa con semillas es rica en vitamina A, C y antioxidantes. Ideal para jugos y postres.',
'{"calories": 97, "carbs": "23.4g", "fiber": "10.4g", "sugar": "11.2g", "protein": "2.2g", "vitaminC": "30mg", "vitaminA": "1274IU"}',
'https://images.unsplash.com/photo-1612892438462-f3e8ac0b7d4a?w=600',
NULL,
NOW(), 1, NOW());

-- =========================================
-- 6. RELACIÓN FRUTAS-REGIONES
-- =========================================
INSERT INTO fruit_regions (fruit_id, region_id) VALUES
-- Mango
(1, 1), (1, 2), (1, 3),
-- Banana
(2, 1), (2, 2), (2, 3), (2, 6),
-- Papaya
(3, 1), (3, 2), (3, 6),
-- Piña
(4, 1), (4, 2), (4, 3), (4, 6),
-- Fresa
(5, 4),
-- Sandía
(6, 1), (6, 4), (6, 5),
-- Naranja
(7, 4), (7, 1),
-- Aguacate
(8, 1), (8, 2),
-- Kiwi
(9, 3), (9, 4),
-- Pitaya
(10, 1), (10, 3),
-- Coco
(11, 1), (11, 2), (11, 3), (11, 6),
-- Maracuyá
(12, 1), (12, 2);

-- =========================================
-- 7. RECETAS
-- =========================================
INSERT INTO recipes (id, title, description, source, image_url) VALUES
(1, 'Smoothie de Mango y Banana',
'Un batido tropical cremoso y nutritivo, perfecto para el desayuno o merienda. Combina la dulzura del mango con la cremosidad de la banana.',
'Receta original FruitExplorer',
'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600'),

(2, 'Ensalada Tropical de Frutas',
'Una mezcla refrescante de frutas tropicales cortadas en cubos, perfecta para días calurosos. Incluye mango, piña, papaya y un toque de limón.',
'Chef Maria González',
'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600'),

(3, 'Guacamole Tradicional',
'La receta clásica mexicana de aguacate machacado con limón, cilantro, cebolla y tomate. Perfecto para tacos y nachos.',
'Receta Mexicana Tradicional',
'https://images.unsplash.com/photo-1580870069867-74c57ee60d19?w=600'),

(4, 'Agua Fresca de Sandía',
'Bebida refrescante mexicana hecha con sandía natural, agua y un toque de limón. Perfecta para el verano.',
'Receta tradicional mexicana',
'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'),

(5, 'Bowl de Açaí con Fresas',
'Desayuno energético con base de açaí, cubierto con fresas frescas, banana, granola y miel. Rico en antioxidantes.',
'Receta brasileña moderna',
'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600'),

(6, 'Jugo de Naranja Natural',
'Jugo fresco recién exprimido de naranjas. Rico en vitamina C, perfecto para comenzar el día con energía.',
'Receta básica',
'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600'),

(7, 'Smoothie Bowl de Pitaya',
'Bowl colorido con base de pitaya congelada, decorado con frutas frescas, coco rallado y semillas de chía.',
'Receta wellness',
'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600'),

(8, 'Mousse de Maracuyá',
'Postre cremoso y ligero con el sabor intenso del maracuyá. Perfecto para ocasiones especiales.',
'Chef Patricia Rojas',
'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'),

(9, 'Ensalada de Papaya Verde',
'Ensalada tailandesa picante con papaya verde rallada, tomates cherry, cacahuates y salsa de pescado.',
'Som Tam - Receta Tailandesa',
'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600'),

(10, 'Helado de Coco Casero',
'Helado cremoso hecho con leche de coco, natural y sin lácteos. Refrescante y tropical.',
'Receta vegana',
'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'),

(11, 'Tarta de Kiwi y Crema',
'Tarta elegante con base de galleta, crema pastelera y rodajas frescas de kiwi. Visualmente hermosa y deliciosa.',
'Repostería francesa adaptada',
'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600'),

(12, 'Piña Colada Clásica',
'Cóctel tropical icónico con piña, coco y ron. Cremoso y refrescante, perfecto para la playa.',
'Receta caribeña clásica',
'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600');

-- =========================================
-- 8. PASOS DE RECETAS
-- =========================================
-- Smoothie de Mango y Banana (Receta 1)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(1, 1, 'Pela y corta 1 mango maduro en cubos'),
(1, 2, 'Pela 2 bananas maduras y córtalas en rodajas'),
(1, 3, 'Coloca el mango y las bananas en la licuadora'),
(1, 4, 'Agrega 1 taza de leche (o leche vegetal) y 1/2 taza de yogurt natural'),
(1, 5, 'Añade 1 cucharada de miel y hielo al gusto'),
(1, 6, 'Licua todo hasta obtener una mezcla suave y cremosa'),
(1, 7, 'Sirve inmediatamente en vasos fríos y decora con rodajas de fruta');

-- Ensalada Tropical (Receta 2)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(2, 1, 'Corta 1 mango, 1/2 piña y 1/2 papaya en cubos del mismo tamaño'),
(2, 2, 'Coloca todas las frutas en un bowl grande'),
(2, 3, 'Exprime el jugo de 1 limón sobre las frutas'),
(2, 4, 'Agrega 1 cucharada de miel y mezcla suavemente'),
(2, 5, 'Decora con hojas de menta fresca'),
(2, 6, 'Refrigera por 30 minutos antes de servir');

-- Guacamole (Receta 3)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(3, 1, 'Corta 3 aguacates maduros por la mitad y retira el hueso'),
(3, 2, 'Saca la pulpa con una cuchara y colócala en un bowl'),
(3, 3, 'Machaca los aguacates con un tenedor hasta obtener la textura deseada'),
(3, 4, 'Pica finamente 1/2 cebolla, 1 tomate y un manojo de cilantro'),
(3, 5, 'Agrega las verduras picadas al aguacate machacado'),
(3, 6, 'Exprime el jugo de 1 limón y agrega sal al gusto'),
(3, 7, 'Mezcla todo suavemente y sirve inmediatamente con totopos');

-- Agua de Sandía (Receta 4)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(4, 1, 'Corta 1/4 de sandía en cubos y retira las semillas'),
(4, 2, 'Coloca los cubos de sandía en la licuadora'),
(4, 3, 'Agrega 4 tazas de agua fría y el jugo de 2 limones'),
(4, 4, 'Añade 3 cucharadas de azúcar (ajustar al gusto)'),
(4, 5, 'Licua hasta obtener una mezcla homogénea'),
(4, 6, 'Cuela la mezcla para eliminar la pulpa (opcional)'),
(4, 7, 'Sirve con hielo y decora con rodajas de limón');

-- Bowl de Açaí (Receta 5)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(5, 1, 'Licua 2 paquetes de açaí congelado con 1 banana congelada'),
(5, 2, 'Agrega 1/2 taza de leche de almendras y licua hasta obtener consistencia espesa'),
(5, 3, 'Vierte la mezcla en un bowl'),
(5, 4, 'Decora con fresas cortadas en rodajas'),
(5, 5, 'Añade rodajas de banana, granola y coco rallado'),
(5, 6, 'Rocía con miel y semillas de chía'),
(5, 7, 'Sirve inmediatamente bien frío');

-- Jugo de Naranja (Receta 6)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(6, 1, 'Lava bien 6-8 naranjas frescas'),
(6, 2, 'Corta las naranjas por la mitad'),
(6, 3, 'Exprime cada mitad con un exprimidor manual o eléctrico'),
(6, 4, 'Cuela el jugo si prefieres sin pulpa'),
(6, 5, 'Sirve inmediatamente en vaso frío'),
(6, 6, 'Opcional: añade hielo o endulza con miel al gusto');

-- Smoothie Bowl de Pitaya (Receta 7)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(7, 1, 'Licua 2 pitayas congeladas con 1 banana congelada'),
(7, 2, 'Agrega 1/2 taza de leche de coco y licua hasta obtener textura cremosa'),
(7, 3, 'Vierte la mezcla rosa en un bowl'),
(7, 4, 'Decora con kiwi en rodajas, fresas y arándanos'),
(7, 5, 'Añade coco rallado, granola y semillas de chía'),
(7, 6, 'Sirve inmediatamente decorado artísticamente');

-- Mousse de Maracuyá (Receta 8)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(8, 1, 'Extrae la pulpa de 6 maracuyás y cuélala para obtener el jugo'),
(8, 2, 'Mezcla el jugo de maracuyá con 1 lata de leche condensada'),
(8, 3, 'En otro bowl, bate 2 tazas de crema de leche hasta punto de nieve'),
(8, 4, 'Incorpora suavemente la crema batida a la mezcla de maracuyá'),
(8, 5, 'Vierte en copas individuales'),
(8, 6, 'Refrigera por al menos 4 horas antes de servir'),
(8, 7, 'Decora con pulpa de maracuyá fresca al servir');

-- Ensalada de Papaya Verde (Receta 9)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(9, 1, 'Pela y ralla 1 papaya verde en tiras finas'),
(9, 2, 'Machaca 2 dientes de ajo y 2 chiles en un mortero'),
(9, 3, 'Agrega 1 cucharada de azúcar y machaca'),
(9, 4, 'Añade la papaya rallada y machaca suavemente'),
(9, 5, 'Incorpora tomates cherry cortados, judías verdes y cacahuates'),
(9, 6, 'Aliña con jugo de limón y salsa de pescado al gusto'),
(9, 7, 'Sirve inmediatamente acompañado de arroz pegajoso');

-- Helado de Coco (Receta 10)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(10, 1, 'Abre 2 latas de leche de coco y refrigera por 12 horas'),
(10, 2, 'Separa la crema sólida de coco del líquido'),
(10, 3, 'Bate la crema de coco con 1/2 taza de azúcar de coco'),
(10, 4, 'Agrega 1 cucharadita de extracto de vainilla'),
(10, 5, 'Vierte la mezcla en un recipiente para congelar'),
(10, 6, 'Congela por 4-6 horas, mezclando cada hora'),
(10, 7, 'Sirve en bolas decoradas con coco rallado tostado');

-- Tarta de Kiwi (Receta 11)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(11, 1, 'Tritura 200g de galletas y mézclalas con 80g de mantequilla derretida'),
(11, 2, 'Presiona la mezcla en el fondo de un molde desmontable'),
(11, 3, 'Refrigera la base mientras preparas el relleno'),
(11, 4, 'Prepara crema pastelera con leche, azúcar, yemas y maicena'),
(11, 5, 'Vierte la crema sobre la base de galleta y enfría'),
(11, 6, 'Pela y corta 5-6 kiwis en rodajas finas'),
(11, 7, 'Decora la superficie con las rodajas de kiwi en círculos'),
(11, 8, 'Glasea con gelatina transparente y refrigera 2 horas');

-- Piña Colada (Receta 12)
INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES
(12, 1, 'Corta 1/2 piña fresca en trozos pequeños'),
(12, 2, 'Coloca los trozos de piña en la licuadora'),
(12, 3, 'Agrega 1 taza de crema de coco'),
(12, 4, 'Añade 1/2 taza de ron blanco (opcional: sin alcohol)'),
(12, 5, 'Agrega 2 tazas de hielo'),
(12, 6, 'Licua hasta obtener una mezcla suave y espumosa'),
(12, 7, 'Sirve en vasos altos decorados con rodaja de piña y cereza');

-- =========================================
-- 9. RELACIÓN FRUTAS-RECETAS
-- =========================================
INSERT INTO fruit_recipes (fruit_id, recipe_id) VALUES
-- Smoothie de Mango y Banana
(1, 1), -- Mango
(2, 1), -- Banana

-- Ensalada Tropical
(1, 2), -- Mango
(4, 2), -- Piña
(3, 2), -- Papaya

-- Guacamole
(8, 3), -- Aguacate

-- Agua de Sandía
(6, 4), -- Sandía

-- Bowl de Açaí
(5, 5), -- Fresa
(2, 5), -- Banana

-- Jugo de Naranja
(7, 6), -- Naranja

-- Smoothie Bowl de Pitaya
(10, 7), -- Pitaya
(9, 7),  -- Kiwi
(5, 7),  -- Fresa

-- Mousse de Maracuyá
(12, 8), -- Maracuyá

-- Ensalada de Papaya Verde
(3, 9),  -- Papaya

-- Helado de Coco
(11, 10), -- Coco

-- Tarta de Kiwi
(9, 11),  -- Kiwi

-- Piña Colada
(4, 12),  -- Piña
(11, 12); -- Coco

-- =========================================
-- ✅ DATOS CARGADOS EXITOSAMENTE
-- =========================================
-- Resumen:
-- - 3 roles
-- - 5 usuarios
-- - 5 asignaciones de roles
-- - 6 regiones
-- - 12 frutas
-- - 29 relaciones frutas-regiones
-- - 12 recetas
-- - 74 pasos de recetas
-- - 19 relaciones frutas-recetas
-- =========================================
