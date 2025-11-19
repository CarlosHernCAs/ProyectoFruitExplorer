import pool from '../config/db.js';

// =========================================
// ANALYTICS AVANZADOS
// =========================================

/**
 * GET /api/analytics/trends
 * Obtiene tendencias de crecimiento por período
 */
export const getTrends = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calcular fechas según período
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    else if (period === '90d') daysBack = 90;
    else if (period === '365d') daysBack = 365;

    const [currentPeriod] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) as fruits,
        (SELECT COUNT(*) FROM recipes WHERE id IN (
          SELECT id FROM recipes ORDER BY id DESC LIMIT 1000
        )) as recipes,
        (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) as users
    `, [daysBack, daysBack]);

    const [previousPeriod] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) as fruits,
        (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) as users
    `, [daysBack * 2, daysBack, daysBack * 2, daysBack]);

    // Calcular porcentaje de cambio
    const fruitChange = previousPeriod[0].fruits > 0
      ? ((currentPeriod[0].fruits - previousPeriod[0].fruits) / previousPeriod[0].fruits * 100).toFixed(1)
      : 100;

    const userChange = previousPeriod[0].users > 0
      ? ((currentPeriod[0].users - previousPeriod[0].users) / previousPeriod[0].users * 100).toFixed(1)
      : 100;

    // Tasa de creación promedio (items por día)
    const [avgCreation] = await pool.query(`
      SELECT
        COUNT(*) / ? as fruitsPerDay,
        (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) / ? as usersPerDay
      FROM fruits
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [daysBack, daysBack, daysBack, daysBack]);

    res.status(200).json({
      period,
      daysBack,
      current: currentPeriod[0],
      previous: previousPeriod[0],
      changes: {
        fruits: parseFloat(fruitChange),
        users: parseFloat(userChange)
      },
      averages: {
        fruitsPerDay: parseFloat(avgCreation[0].fruitsPerDay).toFixed(2),
        usersPerDay: parseFloat(avgCreation[0].usersPerDay).toFixed(2)
      }
    });
  } catch (err) {
    console.error('Error in getTrends:', err);
    res.status(500).json({ mensaje: 'Error al obtener tendencias' });
  }
};

/**
 * GET /api/analytics/activity-heatmap
 * Obtiene datos para heatmap de actividad
 */
export const getActivityHeatmap = async (req, res) => {
  try {
    // Actividad por día de la semana (0=Domingo, 6=Sábado)
    const [byWeekday] = await pool.query(`
      SELECT
        DAYOFWEEK(created_at) - 1 as weekday,
        COUNT(*) as count
      FROM (
        SELECT created_at FROM fruits WHERE created_at IS NOT NULL
        UNION ALL
        SELECT created_at FROM users WHERE created_at IS NOT NULL
      ) as combined
      GROUP BY weekday
      ORDER BY weekday
    `);

    // Actividad por hora del día (si tenemos timestamps con hora)
    const [byHour] = await pool.query(`
      SELECT
        HOUR(created_at) as hour,
        COUNT(*) as count
      FROM (
        SELECT created_at FROM fruits WHERE created_at IS NOT NULL
        UNION ALL
        SELECT created_at FROM users WHERE created_at IS NOT NULL
      ) as combined
      GROUP BY hour
      ORDER BY hour
    `);

    // Días más activos (top 10)
    const [topDays] = await pool.query(`
      SELECT
        DATE(created_at) as day,
        COUNT(*) as count
      FROM (
        SELECT created_at FROM fruits WHERE created_at IS NOT NULL
        UNION ALL
        SELECT created_at FROM users WHERE created_at IS NOT NULL
      ) as combined
      GROUP BY day
      ORDER BY count DESC
      LIMIT 10
    `);

    // Formatear para heatmap
    const weekdayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const formattedByWeekday = byWeekday.map(item => ({
      weekday: weekdayNames[item.weekday],
      weekdayNum: item.weekday,
      count: item.count
    }));

    res.status(200).json({
      byWeekday: formattedByWeekday,
      byHour,
      topDays
    });
  } catch (err) {
    console.error('Error in getActivityHeatmap:', err);
    res.status(500).json({ mensaje: 'Error al obtener heatmap de actividad' });
  }
};

/**
 * GET /api/analytics/user-engagement
 * Métricas de engagement de usuarios
 */
export const getUserEngagement = async (req, res) => {
  try {
    // Usuarios activos diarios (DAU) - último login en últimas 24 horas
    const [dau] = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE last_login >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    `);

    // Usuarios activos mensuales (MAU) - último login en últimos 30 días
    const [mau] = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Ratio DAU/MAU (indicador de engagement)
    const dauMauRatio = mau[0].count > 0
      ? ((dau[0].count / mau[0].count) * 100).toFixed(2)
      : 0;

    // Nuevos usuarios últimos 30 días
    const [newUsers] = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Usuarios recurrentes (han hecho login más de 1 vez)
    const [recurringUsers] = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE last_login IS NOT NULL
      AND last_login != created_at
    `);

    // Tasa de retención (usuarios que volvieron después del primer login)
    const [totalRegistered] = await pool.query(`
      SELECT COUNT(*) as count FROM users
    `);

    const retentionRate = totalRegistered[0].count > 0
      ? ((recurringUsers[0].count / totalRegistered[0].count) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      dau: dau[0].count,
      mau: mau[0].count,
      dauMauRatio: parseFloat(dauMauRatio),
      newUsersLast30Days: newUsers[0].count,
      recurringUsers: recurringUsers[0].count,
      retentionRate: parseFloat(retentionRate),
      totalUsers: totalRegistered[0].count
    });
  } catch (err) {
    console.error('Error in getUserEngagement:', err);
    res.status(500).json({ mensaje: 'Error al obtener engagement de usuarios' });
  }
};

/**
 * GET /api/analytics/content-health
 * Score de salud del contenido
 */
export const getContentHealth = async (req, res) => {
  try {
    // Frutas: completas = con imagen + descripción + datos nutricionales
    const [fruitHealth] = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE
          WHEN image_url IS NOT NULL
          AND description IS NOT NULL AND description != ''
          AND nutritional IS NOT NULL
          THEN 1
        END) as complete
      FROM fruits
    `);

    const fruitCompleteness = fruitHealth[0].total > 0
      ? ((fruitHealth[0].complete / fruitHealth[0].total) * 100).toFixed(2)
      : 0;

    // Recetas: completas = con descripción + imagen + al menos 1 paso
    const [recipeHealth] = await pool.query(`
      SELECT
        COUNT(DISTINCT r.id) as total,
        COUNT(DISTINCT CASE
          WHEN r.description IS NOT NULL AND r.description != ''
          AND r.image_url IS NOT NULL
          AND rs.id IS NOT NULL
          THEN r.id
        END) as complete
      FROM recipes r
      LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
    `);

    const recipeCompleteness = recipeHealth[0].total > 0
      ? ((recipeHealth[0].complete / recipeHealth[0].total) * 100).toFixed(2)
      : 0;

    // Regiones: completas = con descripción + al menos 1 fruta
    const [regionHealth] = await pool.query(`
      SELECT
        COUNT(DISTINCT r.id) as total,
        COUNT(DISTINCT CASE
          WHEN r.description IS NOT NULL AND r.description != ''
          AND fr.fruit_id IS NOT NULL
          THEN r.id
        END) as complete
      FROM regions r
      LEFT JOIN fruit_regions fr ON r.id = fr.region_id
    `);

    const regionCompleteness = regionHealth[0].total > 0
      ? ((regionHealth[0].complete / regionHealth[0].total) * 100).toFixed(2)
      : 0;

    // Score general (promedio ponderado)
    const overallScore = (
      (parseFloat(fruitCompleteness) * 0.4) +
      (parseFloat(recipeCompleteness) * 0.4) +
      (parseFloat(regionCompleteness) * 0.2)
    ).toFixed(2);

    // Items que necesitan atención
    const [needsAttention] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits WHERE image_url IS NULL) as fruitsWithoutImage,
        (SELECT COUNT(*) FROM fruits WHERE description IS NULL OR description = '') as fruitsWithoutDescription,
        (SELECT COUNT(*) FROM fruits WHERE nutritional IS NULL) as fruitsWithoutNutrition,
        (SELECT COUNT(*) FROM recipes WHERE description IS NULL OR description = '') as recipesWithoutDescription,
        (SELECT COUNT(*) FROM recipes r WHERE NOT EXISTS (SELECT 1 FROM recipe_steps WHERE recipe_id = r.id)) as recipesWithoutSteps
    `);

    res.status(200).json({
      overallScore: parseFloat(overallScore),
      modules: {
        fruits: {
          total: fruitHealth[0].total,
          complete: fruitHealth[0].complete,
          completeness: parseFloat(fruitCompleteness)
        },
        recipes: {
          total: recipeHealth[0].total,
          complete: recipeHealth[0].complete,
          completeness: parseFloat(recipeCompleteness)
        },
        regions: {
          total: regionHealth[0].total,
          complete: regionHealth[0].complete,
          completeness: parseFloat(regionCompleteness)
        }
      },
      needsAttention: needsAttention[0]
    });
  } catch (err) {
    console.error('Error in getContentHealth:', err);
    res.status(500).json({ mensaje: 'Error al obtener salud del contenido' });
  }
};

/**
 * GET /api/analytics/growth-projection
 * Proyección de crecimiento basado en tendencias
 */
export const getGrowthProjection = async (req, res) => {
  try {
    // Crecimiento promedio últimos 6 meses
    const [monthlyGrowth] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as fruits,
        (SELECT COUNT(*) FROM users u WHERE DATE_FORMAT(u.created_at, '%Y-%m') = DATE_FORMAT(f.created_at, '%Y-%m')) as users
      FROM fruits f
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    // Calcular tendencia lineal simple
    const months = monthlyGrowth.length;
    let avgFruitsGrowth = 0;
    let avgUsersGrowth = 0;

    if (months > 1) {
      avgFruitsGrowth = (monthlyGrowth[months - 1].fruits - monthlyGrowth[0].fruits) / months;
      avgUsersGrowth = (monthlyGrowth[months - 1].users - monthlyGrowth[0].users) / months;
    }

    // Proyectar próximos 3 meses
    const [current] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM fruits) as currentFruits,
        (SELECT COUNT(*) FROM users) as currentUsers
    `);

    const projections = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);

      projections.push({
        month: futureDate.toISOString().slice(0, 7),
        projectedFruits: Math.round(current[0].currentFruits + (avgFruitsGrowth * i)),
        projectedUsers: Math.round(current[0].currentUsers + (avgUsersGrowth * i))
      });
    }

    res.status(200).json({
      historicalData: monthlyGrowth,
      averageMonthlyGrowth: {
        fruits: parseFloat(avgFruitsGrowth).toFixed(2),
        users: parseFloat(avgUsersGrowth).toFixed(2)
      },
      current: current[0],
      projections
    });
  } catch (err) {
    console.error('Error in getGrowthProjection:', err);
    res.status(500).json({ mensaje: 'Error al calcular proyección de crecimiento' });
  }
};
