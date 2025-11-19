import pool from '../config/db.js';

// =========================================
// ESTADÍSTICAS BÁSICAS
// =========================================

/**
 * GET /api/dashboard/stats
 * Obtiene estadísticas generales del sistema
 */
export const getBasicStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits) as totalFruits,
        (SELECT COUNT(*) FROM recipes) as totalRecipes,
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COUNT(*) FROM regions) as totalRegions,
        (SELECT COUNT(*) FROM fruit_recipes) as totalFruitRecipeLinks,
        (SELECT COUNT(*) FROM recipe_steps) as totalRecipeSteps
    `);

    // Calcular crecimiento del mes actual vs mes anterior
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [growth] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?) as fruitsThisMonth,
        (SELECT COUNT(*) FROM fruits WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?) as fruitsLastMonth,
        (SELECT COUNT(*) FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?) as usersThisMonth,
        (SELECT COUNT(*) FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?) as usersLastMonth
    `, [
      currentMonth, currentYear,
      currentMonth - 1, currentYear,
      currentMonth, currentYear,
      currentMonth - 1, currentYear
    ]);

    res.status(200).json({
      stats: stats[0],
      growth: growth[0]
    });
  } catch (err) {
    console.error('Error in getBasicStats:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas básicas' });
  }
};

/**
 * GET /api/dashboard/overview
 * Obtiene resumen general para el dashboard principal
 */
export const getOverview = async (req, res) => {
  try {
    // Frutas más populares (las que tienen más recetas)
    const [topFruits] = await pool.query(`
      SELECT f.id, f.common_name, f.image_url, COUNT(fr.recipe_id) as recipeCount
      FROM fruits f
      LEFT JOIN fruit_recipes fr ON f.id = fr.fruit_id
      GROUP BY f.id
      ORDER BY recipeCount DESC
      LIMIT 5
    `);

    // Últimas frutas agregadas
    const [recentFruits] = await pool.query(`
      SELECT id, common_name, scientific_name, image_url, created_at
      FROM fruits
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Últimas recetas creadas
    const [recentRecipes] = await pool.query(`
      SELECT id, title, description, image_url
      FROM recipes
      ORDER BY id DESC
      LIMIT 5
    `);

    // Usuarios recientes
    const [recentUsers] = await pool.query(`
      SELECT id, email, display_name, created_at, last_login
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      topFruits,
      recentFruits,
      recentRecipes,
      recentUsers
    });
  } catch (err) {
    console.error('Error in getOverview:', err);
    res.status(500).json({ mensaje: 'Error al obtener overview' });
  }
};

/**
 * GET /api/dashboard/activity
 * Obtiene actividad reciente del sistema
 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Actividad combinada de todas las tablas
    const [activity] = await pool.query(`
      SELECT 'fruit' as type, id, common_name as name, created_at
      FROM fruits
      UNION ALL
      SELECT 'recipe' as type, id, title as name, id as created_at
      FROM recipes
      UNION ALL
      SELECT 'user' as type, id, display_name as name, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ?
    `, [limit]);

    res.status(200).json({ activity });
  } catch (err) {
    console.error('Error in getRecentActivity:', err);
    res.status(500).json({ mensaje: 'Error al obtener actividad reciente' });
  }
};

// =========================================
// ESTADÍSTICAS POR MÓDULO
// =========================================

/**
 * GET /api/dashboard/fruits/stats
 * Estadísticas detalladas de frutas
 */
export const getFruitStats = async (req, res) => {
  try {
    // Stats generales
    const [general] = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as withImage,
        COUNT(CASE WHEN image_url IS NULL THEN 1 END) as withoutImage,
        COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as withDescription,
        COUNT(CASE WHEN nutritional IS NOT NULL THEN 1 END) as withNutritional
      FROM fruits
    `);

    // Frutas por región
    const [byRegion] = await pool.query(`
      SELECT r.name, r.id, COUNT(fr.fruit_id) as fruitCount
      FROM regions r
      LEFT JOIN fruit_regions fr ON r.id = fr.region_id
      GROUP BY r.id
      ORDER BY fruitCount DESC
    `);

    // Top frutas con más recetas
    const [topWithRecipes] = await pool.query(`
      SELECT f.id, f.common_name, f.image_url, COUNT(fr.recipe_id) as recipeCount
      FROM fruits f
      LEFT JOIN fruit_recipes fr ON f.id = fr.fruit_id
      GROUP BY f.id
      ORDER BY recipeCount DESC
      LIMIT 10
    `);

    // Frutas sin recetas
    const [withoutRecipes] = await pool.query(`
      SELECT f.id, f.common_name, f.image_url
      FROM fruits f
      LEFT JOIN fruit_recipes fr ON f.id = fr.fruit_id
      WHERE fr.recipe_id IS NULL
    `);

    // Timeline de creación (por mes)
    const [timeline] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM fruits
      WHERE created_at IS NOT NULL
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `);

    res.status(200).json({
      general: general[0],
      byRegion,
      topWithRecipes,
      withoutRecipes,
      timeline
    });
  } catch (err) {
    console.error('Error in getFruitStats:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas de frutas' });
  }
};

/**
 * GET /api/dashboard/recipes/stats
 * Estadísticas detalladas de recetas
 */
export const getRecipeStats = async (req, res) => {
  try {
    // Stats generales
    const [general] = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as withImage,
        COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as withDescription
      FROM recipes
    `);

    // Recetas con/sin pasos
    const [withSteps] = await pool.query(`
      SELECT
        r.id,
        r.title,
        COUNT(rs.id) as stepCount
      FROM recipes r
      LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
      GROUP BY r.id
      HAVING stepCount > 0
    `);

    const [withoutSteps] = await pool.query(`
      SELECT r.id, r.title
      FROM recipes r
      LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
      WHERE rs.id IS NULL
    `);

    // Distribución de pasos
    const [stepDistribution] = await pool.query(`
      SELECT
        CASE
          WHEN stepCount = 0 THEN '0 pasos'
          WHEN stepCount BETWEEN 1 AND 5 THEN '1-5 pasos'
          WHEN stepCount BETWEEN 6 AND 10 THEN '6-10 pasos'
          ELSE '11+ pasos'
        END as range,
        COUNT(*) as count
      FROM (
        SELECT r.id, COUNT(rs.id) as stepCount
        FROM recipes r
        LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
        GROUP BY r.id
      ) as counts
      GROUP BY range
    `);

    // Recetas por fuente/autor
    const [bySource] = await pool.query(`
      SELECT source, COUNT(*) as count
      FROM recipes
      WHERE source IS NOT NULL AND source != ''
      GROUP BY source
      ORDER BY count DESC
    `);

    // Recetas sin frutas
    const [withoutFruits] = await pool.query(`
      SELECT r.id, r.title
      FROM recipes r
      LEFT JOIN fruit_recipes fr ON r.id = fr.recipe_id
      WHERE fr.fruit_id IS NULL
    `);

    res.status(200).json({
      general: {
        ...general[0],
        withSteps: withSteps.length,
        withoutSteps: withoutSteps.length
      },
      stepDistribution,
      bySource,
      withoutFruits,
      recipesWithSteps: withSteps.slice(0, 10),
      recipesWithoutSteps: withoutSteps.slice(0, 10)
    });
  } catch (err) {
    console.error('Error in getRecipeStats:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas de recetas' });
  }
};

/**
 * GET /api/dashboard/users/stats
 * Estadísticas detalladas de usuarios
 */
export const getUserStats = async (req, res) => {
  try {
    // Stats generales
    const [general] = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN last_login IS NOT NULL THEN 1 END) as everLoggedIn,
        COUNT(CASE WHEN last_login IS NULL THEN 1 END) as neverLoggedIn,
        COUNT(CASE WHEN display_name IS NOT NULL AND display_name != '' THEN 1 END) as withDisplayName
      FROM users
    `);

    // Usuarios por rol
    const [byRole] = await pool.query(`
      SELECT r.name as role, COUNT(ur.user_id) as userCount
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.id
      ORDER BY userCount DESC
    `);

    // Usuarios activos (último login en últimos 30 días)
    const [activeUsers] = await pool.query(`
      SELECT
        COUNT(*) as active30Days
      FROM users
      WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Timeline de registros
    const [timeline] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM users
      WHERE created_at IS NOT NULL
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `);

    // Últimos logins
    const [recentLogins] = await pool.query(`
      SELECT id, email, display_name, last_login
      FROM users
      WHERE last_login IS NOT NULL
      ORDER BY last_login DESC
      LIMIT 10
    `);

    // Usuarios sin login
    const [neverLogged] = await pool.query(`
      SELECT id, email, display_name, created_at
      FROM users
      WHERE last_login IS NULL
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.status(200).json({
      general: {
        ...general[0],
        active30Days: activeUsers[0].active30Days
      },
      byRole,
      timeline,
      recentLogins,
      neverLogged
    });
  } catch (err) {
    console.error('Error in getUserStats:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas de usuarios' });
  }
};

/**
 * GET /api/dashboard/regions/stats
 * Estadísticas detalladas de regiones
 */
export const getRegionStats = async (req, res) => {
  try {
    // Stats generales
    const [general] = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as withDescription,
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as withImage
      FROM regions
    `);

    // Regiones con conteo de frutas
    const [withFruits] = await pool.query(`
      SELECT r.id, r.name, r.image_url, COUNT(fr.fruit_id) as fruitCount
      FROM regions r
      LEFT JOIN fruit_regions fr ON r.id = fr.region_id
      GROUP BY r.id
      ORDER BY fruitCount DESC
    `);

    // Región con más frutas
    const regionWithMostFruits = withFruits[0] || null;

    // Regiones sin frutas
    const regionsWithoutFruits = withFruits.filter(r => r.fruitCount === 0);

    res.status(200).json({
      general: {
        ...general[0],
        withFruits: withFruits.filter(r => r.fruitCount > 0).length,
        withoutFruits: regionsWithoutFruits.length
      },
      regionWithMostFruits,
      allRegions: withFruits,
      regionsWithoutFruits
    });
  } catch (err) {
    console.error('Error in getRegionStats:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas de regiones' });
  }
};
