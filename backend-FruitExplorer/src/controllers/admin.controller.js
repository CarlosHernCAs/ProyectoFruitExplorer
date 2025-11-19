import pool from '../config/db.js';

// =========================================
// OPERACIONES EN BULK
// =========================================

/**
 * POST /api/admin/bulk/delete-fruits
 * Elimina múltiples frutas a la vez
 */
export const bulkDeleteFruits = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ mensaje: 'Se requiere un array de IDs' });
    }

    const placeholders = ids.map(() => '?').join(',');

    // Eliminar relaciones primero
    await pool.query(`DELETE FROM fruit_regions WHERE fruit_id IN (${placeholders})`, ids);
    await pool.query(`DELETE FROM fruit_recipes WHERE fruit_id IN (${placeholders})`, ids);

    // Eliminar frutas
    const [result] = await pool.query(`DELETE FROM fruits WHERE id IN (${placeholders})`, ids);

    res.status(200).json({
      mensaje: `${result.affectedRows} frutas eliminadas correctamente`,
      deleted: result.affectedRows
    });
  } catch (err) {
    console.error('Error in bulkDeleteFruits:', err);
    res.status(500).json({ mensaje: 'Error al eliminar frutas en bulk' });
  }
};

/**
 * POST /api/admin/bulk/delete-recipes
 * Elimina múltiples recetas a la vez
 */
export const bulkDeleteRecipes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ mensaje: 'Se requiere un array de IDs' });
    }

    const placeholders = ids.map(() => '?').join(',');

    // Eliminar relaciones y pasos
    await pool.query(`DELETE FROM fruit_recipes WHERE recipe_id IN (${placeholders})`, ids);
    await pool.query(`DELETE FROM recipe_steps WHERE recipe_id IN (${placeholders})`, ids);

    // Eliminar recetas
    const [result] = await pool.query(`DELETE FROM recipes WHERE id IN (${placeholders})`, ids);

    res.status(200).json({
      mensaje: `${result.affectedRows} recetas eliminadas correctamente`,
      deleted: result.affectedRows
    });
  } catch (err) {
    console.error('Error in bulkDeleteRecipes:', err);
    res.status(500).json({ mensaje: 'Error al eliminar recetas en bulk' });
  }
};

/**
 * POST /api/admin/bulk/assign-region
 * Asigna una región a múltiples frutas
 */
export const bulkAssignRegion = async (req, res) => {
  try {
    const { fruitIds, regionId } = req.body;

    if (!fruitIds || !Array.isArray(fruitIds) || fruitIds.length === 0) {
      return res.status(400).json({ mensaje: 'Se requiere un array de fruitIds' });
    }

    if (!regionId) {
      return res.status(400).json({ mensaje: 'Se requiere regionId' });
    }

    // Verificar que la región existe
    const [region] = await pool.query('SELECT id FROM regions WHERE id = ?', [regionId]);
    if (region.length === 0) {
      return res.status(404).json({ mensaje: 'Región no encontrada' });
    }

    let assigned = 0;

    // Insertar relaciones (ignorar si ya existe)
    for (const fruitId of fruitIds) {
      try {
        await pool.query(
          'INSERT IGNORE INTO fruit_regions (fruit_id, region_id) VALUES (?, ?)',
          [fruitId, regionId]
        );
        assigned++;
      } catch (err) {
        console.error(`Error asignando región a fruta ${fruitId}:`, err);
      }
    }

    res.status(200).json({
      mensaje: `Región asignada a ${assigned} frutas`,
      assigned
    });
  } catch (err) {
    console.error('Error in bulkAssignRegion:', err);
    res.status(500).json({ mensaje: 'Error al asignar región en bulk' });
  }
};

/**
 * POST /api/admin/bulk/assign-role
 * Asigna un rol a múltiples usuarios
 */
export const bulkAssignRole = async (req, res) => {
  try {
    const { userIds, roleId } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ mensaje: 'Se requiere un array de userIds' });
    }

    if (!roleId) {
      return res.status(400).json({ mensaje: 'Se requiere roleId' });
    }

    // Verificar que el rol existe
    const [role] = await pool.query('SELECT id FROM roles WHERE id = ?', [roleId]);
    if (role.length === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    let assigned = 0;

    // Insertar relaciones (ignorar si ya existe)
    for (const userId of userIds) {
      try {
        await pool.query(
          'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [userId, roleId]
        );
        assigned++;
      } catch (err) {
        console.error(`Error asignando rol a usuario ${userId}:`, err);
      }
    }

    res.status(200).json({
      mensaje: `Rol asignado a ${assigned} usuarios`,
      assigned
    });
  } catch (err) {
    console.error('Error in bulkAssignRole:', err);
    res.status(500).json({ mensaje: 'Error al asignar rol en bulk' });
  }
};

// =========================================
// EXPORTACIÓN DE DATOS
// =========================================

/**
 * GET /api/admin/export/fruits?format=json|csv
 * Exporta todos los datos de frutas
 */
export const exportFruits = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const [fruits] = await pool.query(`
      SELECT
        f.id,
        f.slug,
        f.common_name,
        f.scientific_name,
        f.description,
        f.nutritional,
        f.image_url,
        f.created_at,
        GROUP_CONCAT(DISTINCT r.name) as regions,
        COUNT(DISTINCT fr_rec.recipe_id) as recipeCount
      FROM fruits f
      LEFT JOIN fruit_regions fr ON f.id = fr.fruit_id
      LEFT JOIN regions r ON fr.region_id = r.id
      LEFT JOIN fruit_recipes fr_rec ON f.id = fr_rec.fruit_id
      GROUP BY f.id
      ORDER BY f.common_name
    `);

    if (format === 'csv') {
      // Generar CSV
      const headers = ['ID', 'Slug', 'Nombre Común', 'Nombre Científico', 'Descripción', 'Regiones', 'Recetas', 'Imagen URL', 'Creado'];
      let csv = headers.join(',') + '\n';

      fruits.forEach(fruit => {
        const row = [
          fruit.id,
          `"${fruit.slug || ''}"`,
          `"${fruit.common_name || ''}"`,
          `"${fruit.scientific_name || ''}"`,
          `"${(fruit.description || '').replace(/"/g, '""')}"`,
          `"${fruit.regions || ''}"`,
          fruit.recipeCount,
          `"${fruit.image_url || ''}"`,
          fruit.created_at ? new Date(fruit.created_at).toISOString().split('T')[0] : ''
        ];
        csv += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=frutas.csv');
      return res.send('\uFEFF' + csv); // BOM para UTF-8
    }

    // Por defecto, JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=frutas.json');
    res.json(fruits);
  } catch (err) {
    console.error('Error in exportFruits:', err);
    res.status(500).json({ mensaje: 'Error al exportar frutas' });
  }
};

/**
 * GET /api/admin/export/recipes?format=json|csv
 * Exporta todos los datos de recetas
 */
export const exportRecipes = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const [recipes] = await pool.query(`
      SELECT
        r.id,
        r.title,
        r.description,
        r.source,
        r.image_url,
        COUNT(DISTINCT rs.id) as stepCount,
        COUNT(DISTINCT fr.fruit_id) as fruitCount,
        GROUP_CONCAT(DISTINCT f.common_name) as fruits
      FROM recipes r
      LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
      LEFT JOIN fruit_recipes fr ON r.id = fr.recipe_id
      LEFT JOIN fruits f ON fr.fruit_id = f.id
      GROUP BY r.id
      ORDER BY r.title
    `);

    if (format === 'csv') {
      const headers = ['ID', 'Título', 'Descripción', 'Fuente', 'Pasos', 'Frutas', 'Imagen URL'];
      let csv = headers.join(',') + '\n';

      recipes.forEach(recipe => {
        const row = [
          recipe.id,
          `"${recipe.title || ''}"`,
          `"${(recipe.description || '').replace(/"/g, '""')}"`,
          `"${recipe.source || ''}"`,
          recipe.stepCount,
          `"${recipe.fruits || ''}"`,
          `"${recipe.image_url || ''}"`
        ];
        csv += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=recetas.csv');
      return res.send('\uFEFF' + csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=recetas.json');
    res.json(recipes);
  } catch (err) {
    console.error('Error in exportRecipes:', err);
    res.status(500).json({ mensaje: 'Error al exportar recetas' });
  }
};

/**
 * GET /api/admin/export/users?format=json|csv
 * Exporta datos de usuarios (sin contraseñas)
 */
export const exportUsers = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const [users] = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.display_name,
        u.created_at,
        u.last_login,
        GROUP_CONCAT(DISTINCT r.name) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    if (format === 'csv') {
      const headers = ['ID', 'Email', 'Nombre', 'Roles', 'Registro', 'Último Login'];
      let csv = headers.join(',') + '\n';

      users.forEach(user => {
        const row = [
          user.id,
          `"${user.email || ''}"`,
          `"${user.display_name || ''}"`,
          `"${user.roles || ''}"`,
          user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
          user.last_login ? new Date(user.last_login).toISOString() : ''
        ];
        csv += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
      return res.send('\uFEFF' + csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.json');
    res.json(users);
  } catch (err) {
    console.error('Error in exportUsers:', err);
    res.status(500).json({ mensaje: 'Error al exportar usuarios' });
  }
};

// =========================================
// VALIDACIÓN Y MANTENIMIENTO
// =========================================

/**
 * GET /api/admin/health-check
 * Verifica la salud y consistencia de los datos
 */
export const healthCheck = async (req, res) => {
  try {
    const issues = [];

    // 1. Verificar imágenes sin URL
    const [missingImages] = await pool.query(`
      SELECT 'fruit' as type, id, common_name as name
      FROM fruits
      WHERE image_url IS NULL OR image_url = ''
      UNION ALL
      SELECT 'recipe' as type, id, title as name
      FROM recipes
      WHERE image_url IS NULL OR image_url = ''
    `);

    if (missingImages.length > 0) {
      issues.push({
        type: 'missing_images',
        severity: 'warning',
        count: missingImages.length,
        message: `${missingImages.length} items sin imagen`,
        items: missingImages
      });
    }

    // 2. Verificar frutas sin descripción
    const [missingDescriptions] = await pool.query(`
      SELECT id, common_name
      FROM fruits
      WHERE description IS NULL OR description = ''
    `);

    if (missingDescriptions.length > 0) {
      issues.push({
        type: 'missing_descriptions',
        severity: 'info',
        count: missingDescriptions.length,
        message: `${missingDescriptions.length} frutas sin descripción`,
        items: missingDescriptions
      });
    }

    // 3. Verificar recetas sin pasos
    const [recipesWithoutSteps] = await pool.query(`
      SELECT r.id, r.title
      FROM recipes r
      LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
      WHERE rs.id IS NULL
    `);

    if (recipesWithoutSteps.length > 0) {
      issues.push({
        type: 'recipes_without_steps',
        severity: 'warning',
        count: recipesWithoutSteps.length,
        message: `${recipesWithoutSteps.length} recetas sin pasos`,
        items: recipesWithoutSteps
      });
    }

    // 4. Verificar relaciones huérfanas en fruit_recipes
    const [orphanFruitRecipes] = await pool.query(`
      SELECT fr.fruit_id, fr.recipe_id
      FROM fruit_recipes fr
      LEFT JOIN fruits f ON fr.fruit_id = f.id
      LEFT JOIN recipes r ON fr.recipe_id = r.id
      WHERE f.id IS NULL OR r.id IS NULL
    `);

    if (orphanFruitRecipes.length > 0) {
      issues.push({
        type: 'orphan_fruit_recipes',
        severity: 'error',
        count: orphanFruitRecipes.length,
        message: `${orphanFruitRecipes.length} relaciones huérfanas en fruit_recipes`,
        items: orphanFruitRecipes
      });
    }

    // 5. Verificar relaciones huérfanas en fruit_regions
    const [orphanFruitRegions] = await pool.query(`
      SELECT fr.fruit_id, fr.region_id
      FROM fruit_regions fr
      LEFT JOIN fruits f ON fr.fruit_id = f.id
      LEFT JOIN regions r ON fr.region_id = r.id
      WHERE f.id IS NULL OR r.id IS NULL
    `);

    if (orphanFruitRegions.length > 0) {
      issues.push({
        type: 'orphan_fruit_regions',
        severity: 'error',
        count: orphanFruitRegions.length,
        message: `${orphanFruitRegions.length} relaciones huérfanas en fruit_regions`,
        items: orphanFruitRegions
      });
    }

    // 6. Verificar usuarios sin rol
    const [usersWithoutRole] = await pool.query(`
      SELECT u.id, u.email
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role_id IS NULL
    `);

    if (usersWithoutRole.length > 0) {
      issues.push({
        type: 'users_without_role',
        severity: 'warning',
        count: usersWithoutRole.length,
        message: `${usersWithoutRole.length} usuarios sin rol asignado`,
        items: usersWithoutRole
      });
    }

    // Calcular score de salud
    const totalIssues = issues.reduce((sum, issue) => sum + issue.count, 0);
    const criticalIssues = issues.filter(i => i.severity === 'error').reduce((sum, i) => sum + i.count, 0);

    const healthScore = Math.max(0, 100 - (criticalIssues * 10) - (totalIssues * 2));

    res.status(200).json({
      healthScore,
      status: healthScore >= 90 ? 'excellent' : healthScore >= 70 ? 'good' : healthScore >= 50 ? 'fair' : 'poor',
      totalIssues,
      criticalIssues,
      issues,
      recommendations: issues.length === 0 ? ['Todo en orden'] : [
        'Revisa y corrige los items marcados como error',
        'Agrega descripciones a las frutas que les faltan',
        'Añade pasos a las recetas incompletas',
        'Sube imágenes para mejorar la presentación'
      ]
    });
  } catch (err) {
    console.error('Error in healthCheck:', err);
    res.status(500).json({ mensaje: 'Error al ejecutar health check' });
  }
};

/**
 * POST /api/admin/fix-orphans
 * Limpia automáticamente relaciones huérfanas
 */
export const fixOrphans = async (req, res) => {
  try {
    let cleaned = 0;

    // Limpiar fruit_recipes huérfanos
    const [fruitRecipesResult] = await pool.query(`
      DELETE fr FROM fruit_recipes fr
      LEFT JOIN fruits f ON fr.fruit_id = f.id
      LEFT JOIN recipes r ON fr.recipe_id = r.id
      WHERE f.id IS NULL OR r.id IS NULL
    `);
    cleaned += fruitRecipesResult.affectedRows;

    // Limpiar fruit_regions huérfanos
    const [fruitRegionsResult] = await pool.query(`
      DELETE fr FROM fruit_regions fr
      LEFT JOIN fruits f ON fr.fruit_id = f.id
      LEFT JOIN regions r ON fr.region_id = r.id
      WHERE f.id IS NULL OR r.id IS NULL
    `);
    cleaned += fruitRegionsResult.affectedRows;

    // Limpiar user_roles huérfanos
    const [userRolesResult] = await pool.query(`
      DELETE ur FROM user_roles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id IS NULL OR r.id IS NULL
    `);
    cleaned += userRolesResult.affectedRows;

    // Limpiar recipe_steps huérfanos
    const [recipeStepsResult] = await pool.query(`
      DELETE rs FROM recipe_steps rs
      LEFT JOIN recipes r ON rs.recipe_id = r.id
      WHERE r.id IS NULL
    `);
    cleaned += recipeStepsResult.affectedRows;

    res.status(200).json({
      mensaje: `${cleaned} registros huérfanos eliminados`,
      cleaned,
      details: {
        fruitRecipes: fruitRecipesResult.affectedRows,
        fruitRegions: fruitRegionsResult.affectedRows,
        userRoles: userRolesResult.affectedRows,
        recipeSteps: recipeStepsResult.affectedRows
      }
    });
  } catch (err) {
    console.error('Error in fixOrphans:', err);
    res.status(500).json({ mensaje: 'Error al limpiar registros huérfanos' });
  }
};
