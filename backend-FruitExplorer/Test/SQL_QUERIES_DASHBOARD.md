# QUERIES SQL PARA DASHBOARD ADMINISTRATIVO
## FruitExplorer - Implementación de Estadísticas

---

## 1. ESTADÍSTICAS GENERALES

### 1.1 Panel Principal (Dashboard Overview)
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM fruits) as total_fruits,
    (SELECT COUNT(*) FROM recipes) as total_recipes,
    (SELECT COUNT(*) FROM regions) as total_regions,
    (SELECT COUNT(*) FROM queries) as total_queries,
    (SELECT COUNT(*) FROM contributions) as total_contributions,
    (SELECT COUNT(DISTINCT user_id) FROM queries) as users_with_queries,
    (SELECT COUNT(DISTINCT user_id) FROM contributions) as users_with_contributions
;
```

---

## 2. ESTADÍSTICAS DE USUARIOS

### 2.1 Resumen de Usuarios
```sql
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN last_login IS NOT NULL THEN 1 ELSE 0 END) as active_users,
    SUM(CASE WHEN last_login IS NULL THEN 1 ELSE 0 END) as inactive_users,
    COUNT(CASE WHEN DATEDIFF(NOW(), created_at) <= 7 THEN 1 END) as new_users_this_week,
    COUNT(CASE WHEN DATEDIFF(NOW(), created_at) <= 30 THEN 1 END) as new_users_this_month,
    AVG(DATEDIFF(NOW(), last_login)) as avg_days_since_login
FROM users
;
```

### 2.2 Usuarios por Rol
```sql
SELECT 
    r.name as role,
    COUNT(DISTINCT ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
GROUP BY r.id, r.name
ORDER BY user_count DESC
;
```

### 2.3 Usuarios más activos
```sql
SELECT 
    u.id,
    u.email,
    u.display_name,
    u.created_at,
    u.last_login,
    COUNT(q.id) as query_count,
    COUNT(DISTINCT c.id) as contribution_count,
    GROUP_CONCAT(DISTINCT r.name) as roles
FROM users u
LEFT JOIN queries q ON u.id = q.user_id
LEFT JOIN contributions c ON u.id = c.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.display_name, u.created_at, u.last_login
ORDER BY query_count DESC
LIMIT 10
;
```

### 2.4 Actividad de usuarios por período
```sql
SELECT 
    DATE(created_at) as registration_date,
    COUNT(*) as new_users,
    SUM(CASE WHEN last_login IS NOT NULL THEN 1 ELSE 0 END) as active_count
FROM users
GROUP BY DATE(created_at)
ORDER BY registration_date DESC
LIMIT 30
;
```

---

## 3. ESTADÍSTICAS DE FRUTAS

### 3.1 Resumen de Frutas
```sql
SELECT 
    COUNT(*) as total_fruits,
    COUNT(DISTINCT region_id) as total_regions,
    AVG(recipe_count) as avg_recipes_per_fruit,
    COUNT(CASE WHEN recipe_count = 0 THEN 1 END) as fruits_without_recipes
FROM (
    SELECT 
        f.id,
        COUNT(DISTINCT fr.region_id) as region_id,
        COUNT(DISTINCT frec.recipe_id) as recipe_count
    FROM fruits f
    LEFT JOIN fruit_regions fr ON f.id = fr.fruit_id
    LEFT JOIN fruit_recipes frec ON f.id = frec.fruit_id
    GROUP BY f.id
) subquery
;
```

### 3.2 Frutas por Región
```sql
SELECT 
    r.id,
    r.name as region,
    COUNT(DISTINCT fr.fruit_id) as fruit_count,
    GROUP_CONCAT(DISTINCT f.common_name ORDER BY f.common_name) as fruits
FROM regions r
LEFT JOIN fruit_regions fr ON r.id = fr.region_id
LEFT JOIN fruits f ON fr.fruit_id = f.id
GROUP BY r.id, r.name
ORDER BY fruit_count DESC
;
```

### 3.3 Frutas más populares (por recetas)
```sql
SELECT 
    f.id,
    f.common_name,
    f.slug,
    f.image_url,
    COUNT(DISTINCT frec.recipe_id) as recipe_count,
    COUNT(DISTINCT fr.region_id) as region_count,
    f.created_at
FROM fruits f
LEFT JOIN fruit_recipes frec ON f.id = frec.fruit_id
LEFT JOIN fruit_regions fr ON f.id = fr.fruit_id
GROUP BY f.id, f.common_name, f.slug, f.image_url, f.created_at
ORDER BY recipe_count DESC
LIMIT 10
;
```

### 3.4 Frutas sin recetas
```sql
SELECT 
    f.id,
    f.common_name,
    f.scientific_name,
    f.created_at,
    COUNT(DISTINCT fr.region_id) as region_count
FROM fruits f
LEFT JOIN fruit_regions fr ON f.id = fr.fruit_id
WHERE f.id NOT IN (SELECT DISTINCT fruit_id FROM fruit_recipes)
GROUP BY f.id, f.common_name, f.scientific_name, f.created_at
ORDER BY f.created_at DESC
;
```

### 3.5 Historial de sincronización de frutas
```sql
SELECT 
    f.id,
    f.common_name,
    f.last_synced_at,
    u.display_name as synced_by_user,
    DATEDIFF(NOW(), f.last_synced_at) as days_since_sync
FROM fruits f
LEFT JOIN users u ON f.synced_by = u.id
ORDER BY f.last_synced_at DESC NULLS LAST
;
```

### 3.6 Frutas creadas por período
```sql
SELECT 
    DATE(created_at) as creation_date,
    COUNT(*) as fruits_added,
    GROUP_CONCAT(DISTINCT common_name ORDER BY common_name) as fruits
FROM fruits
GROUP BY DATE(created_at)
ORDER BY creation_date DESC
LIMIT 30
;
```

---

## 4. ESTADÍSTICAS DE RECETAS

### 4.1 Resumen de Recetas
```sql
SELECT 
    COUNT(*) as total_recipes,
    COUNT(DISTINCT source) as unique_sources,
    SUM(CASE WHEN step_count > 0 THEN 1 ELSE 0 END) as recipes_with_steps,
    SUM(CASE WHEN step_count = 0 THEN 1 ELSE 0 END) as recipes_without_steps,
    AVG(CASE WHEN step_count > 0 THEN step_count ELSE NULL END) as avg_steps
FROM (
    SELECT 
        r.id,
        r.source,
        COUNT(rs.id) as step_count
    FROM recipes r
    LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
    GROUP BY r.id, r.source
) subquery
;
```

### 4.2 Frutas por Receta
```sql
SELECT 
    r.id,
    r.title,
    r.source,
    COUNT(DISTINCT fr.fruit_id) as fruit_count,
    GROUP_CONCAT(DISTINCT f.common_name ORDER BY f.common_name) as fruits,
    COUNT(DISTINCT rs.id) as step_count
FROM recipes r
LEFT JOIN fruit_recipes fr ON r.id = fr.recipe_id
LEFT JOIN fruits f ON fr.fruit_id = f.id
LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
GROUP BY r.id, r.title, r.source
ORDER BY fruit_count DESC
;
```

### 4.3 Recetas incompletas (falta pasos)
```sql
SELECT 
    r.id,
    r.title,
    r.source,
    COALESCE(COUNT(DISTINCT fr.fruit_id), 0) as fruit_count,
    COALESCE(COUNT(DISTINCT rs.id), 0) as step_count,
    CASE 
        WHEN COUNT(DISTINCT rs.id) = 0 THEN 'Sin pasos'
        WHEN COUNT(DISTINCT rs.id) < 3 THEN 'Muy pocos pasos'
        ELSE 'Completa'
    END as completion_status
FROM recipes r
LEFT JOIN fruit_recipes fr ON r.id = fr.recipe_id
LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
GROUP BY r.id, r.title, r.source
HAVING COUNT(DISTINCT rs.id) < 3
ORDER BY step_count ASC
;
```

### 4.4 Recetas por fuente/autor
```sql
SELECT 
    source,
    COUNT(*) as recipe_count,
    GROUP_CONCAT(DISTINCT title ORDER BY title LIMIT 5) as sample_recipes
FROM recipes
WHERE source IS NOT NULL
GROUP BY source
ORDER BY recipe_count DESC
;
```

---

## 5. ESTADÍSTICAS DE DETECCIONES/QUERIES

### 5.1 Resumen de Queries
```sql
SELECT 
    COUNT(*) as total_queries,
    COUNT(DISTINCT user_id) as users_with_queries,
    COUNT(DISTINCT fruit_id) as fruits_detected,
    COUNT(DISTINCT model_id) as models_used,
    AVG(confidence) as avg_confidence,
    MIN(confidence) as min_confidence,
    MAX(confidence) as max_confidence,
    COUNT(CASE WHEN query_type = 'camera' THEN 1 END) as camera_queries,
    COUNT(CASE WHEN query_type = 'upload' THEN 1 END) as upload_queries,
    COUNT(CASE WHEN voice_enabled = 1 THEN 1 END) as voice_enabled_count
FROM queries
;
```

### 5.2 Top frutas detectadas
```sql
SELECT 
    f.id,
    f.common_name,
    f.slug,
    COUNT(q.id) as detection_count,
    AVG(q.confidence) as avg_confidence,
    COUNT(DISTINCT q.user_id) as unique_users,
    MAX(q.detected_at) as last_detection
FROM queries q
LEFT JOIN fruits f ON q.fruit_id = f.id
GROUP BY f.id, f.common_name, f.slug
ORDER BY detection_count DESC
LIMIT 15
;
```

### 5.3 Detecciones por usuario
```sql
SELECT 
    u.id,
    u.email,
    u.display_name,
    COUNT(q.id) as query_count,
    COUNT(DISTINCT q.fruit_id) as fruits_detected,
    AVG(q.confidence) as avg_confidence,
    MAX(q.detected_at) as last_query,
    GROUP_CONCAT(DISTINCT q.query_type) as query_types_used
FROM users u
LEFT JOIN queries q ON u.id = q.user_id
GROUP BY u.id, u.email, u.display_name
HAVING COUNT(q.id) > 0
ORDER BY query_count DESC
;
```

### 5.4 Detecciones por período
```sql
SELECT 
    DATE(detected_at) as detection_date,
    COUNT(*) as total_queries,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT fruit_id) as unique_fruits,
    AVG(confidence) as avg_confidence,
    COUNT(CASE WHEN query_type = 'camera' THEN 1 END) as camera_count,
    COUNT(CASE WHEN query_type = 'upload' THEN 1 END) as upload_count
FROM queries
GROUP BY DATE(detected_at)
ORDER BY detection_date DESC
LIMIT 30
;
```

### 5.5 Precisión por fruta
```sql
SELECT 
    f.id,
    f.common_name,
    COUNT(q.id) as total_detections,
    COUNT(CASE WHEN q.fruit_id = f.id THEN 1 END) as correct_detections,
    ROUND(AVG(q.confidence) * 100, 2) as avg_confidence_percent,
    ROUND(COUNT(CASE WHEN q.confidence >= 0.8 THEN 1 END) / COUNT(*) * 100, 2) as high_confidence_percent
FROM queries q
RIGHT JOIN fruits f ON q.fruit_id = f.id
GROUP BY f.id, f.common_name
ORDER BY total_detections DESC
;
```

---

## 6. ESTADÍSTICAS DE CONTRIBUCIONES

### 6.1 Resumen de Contribuciones
```sql
SELECT 
    COUNT(*) as total_contributions,
    COUNT(CASE WHEN approved = 1 THEN 1 END) as approved_contributions,
    COUNT(CASE WHEN approved = 0 THEN 1 END) as pending_contributions,
    ROUND(COUNT(CASE WHEN approved = 1 THEN 1 END) / COUNT(*) * 100, 2) as approval_rate,
    COUNT(DISTINCT user_id) as contributors,
    AVG(DATEDIFF(approved_at, submitted_at)) as avg_approval_days
FROM contributions
;
```

### 6.2 Contribuciones por usuario
```sql
SELECT 
    u.id,
    u.email,
    u.display_name,
    COUNT(c.id) as total_contributions,
    COUNT(CASE WHEN c.approved = 1 THEN 1 END) as approved,
    COUNT(CASE WHEN c.approved = 0 THEN 1 END) as pending,
    ROUND(COUNT(CASE WHEN c.approved = 1 THEN 1 END) / COUNT(*) * 100, 2) as approval_rate
FROM users u
LEFT JOIN contributions c ON u.id = c.user_id
GROUP BY u.id, u.email, u.display_name
HAVING COUNT(c.id) > 0
ORDER BY total_contributions DESC
;
```

### 6.3 Contribuciones pendientes
```sql
SELECT 
    c.id,
    c.proposed_name,
    c.submitted_at,
    u.email as submitted_by,
    u.display_name,
    f.common_name as fruit_name,
    DATEDIFF(NOW(), c.submitted_at) as days_pending
FROM contributions c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN fruits f ON c.fruit_id = f.id
WHERE c.approved = 0
ORDER BY c.submitted_at ASC
;
```

### 6.4 Frutas más contribuidas
```sql
SELECT 
    f.id,
    f.common_name,
    COUNT(c.id) as contribution_count,
    COUNT(CASE WHEN c.approved = 1 THEN 1 END) as approved_count,
    COUNT(CASE WHEN c.approved = 0 THEN 1 END) as pending_count,
    GROUP_CONCAT(DISTINCT u.display_name) as contributors
FROM fruits f
LEFT JOIN contributions c ON f.id = c.fruit_id
LEFT JOIN users u ON c.user_id = u.id
WHERE c.id IS NOT NULL
GROUP BY f.id, f.common_name
ORDER BY contribution_count DESC
;
```

---

## 7. ESTADÍSTICAS DE SINCRONIZACIÓN

### 7.1 Estado de sincronización
```sql
SELECT 
    COUNT(*) as total_fruits,
    COUNT(CASE WHEN last_synced_at IS NOT NULL THEN 1 END) as synced_fruits,
    COUNT(CASE WHEN last_synced_at IS NULL THEN 1 END) as not_synced_fruits,
    MAX(last_synced_at) as last_sync_time,
    DATEDIFF(NOW(), MAX(last_synced_at)) as days_since_last_sync
FROM fruits
;
```

### 7.2 Sincronizaciones por usuario
```sql
SELECT 
    u.id,
    u.display_name,
    COUNT(f.id) as fruits_synced,
    MAX(f.last_synced_at) as last_sync_time,
    GROUP_CONCAT(DISTINCT f.common_name ORDER BY f.common_name) as synced_fruits
FROM users u
LEFT JOIN fruits f ON u.id = f.synced_by
WHERE f.id IS NOT NULL
GROUP BY u.id, u.display_name
ORDER BY fruits_synced DESC
;
```

---

## 8. ESTADÍSTICAS DE LOGS DEL SISTEMA

### 8.1 Resumen de Logs
```sql
SELECT 
    level,
    COUNT(*) as log_count,
    DATE(created_at) as log_date,
    GROUP_CONCAT(DISTINCT DATE_FORMAT(created_at, '%H:%i')) as hours_active
FROM system_logs
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY level, DATE(created_at)
ORDER BY log_date DESC, log_count DESC
;
```

### 8.2 Logs recientes
```sql
SELECT 
    id,
    level,
    message,
    created_at,
    context
FROM system_logs
ORDER BY created_at DESC
LIMIT 20
;
```

---

## 9. QUERÍAS ANALÍTICAS AVANZADAS

### 9.1 Relación entre frutas y recetas (Matriz)
```sql
SELECT 
    f.common_name as fruit,
    COUNT(fr.recipe_id) as recipe_count,
    GROUP_CONCAT(DISTINCT r.title ORDER BY r.title LIMIT 3) as top_recipes
FROM fruits f
LEFT JOIN fruit_recipes fr ON f.id = fr.fruit_id
LEFT JOIN recipes r ON fr.recipe_id = r.id
GROUP BY f.id, f.common_name
ORDER BY recipe_count DESC
;
```

### 9.2 Correlación de popularidad (Frutas vs Detecciones vs Recetas)
```sql
SELECT 
    f.id,
    f.common_name,
    COUNT(DISTINCT fr.recipe_id) as recipe_count,
    COUNT(DISTINCT q.id) as detection_count,
    COUNT(DISTINCT freg.region_id) as region_count,
    RANK() OVER (ORDER BY COUNT(DISTINCT q.id) DESC) as detection_rank,
    RANK() OVER (ORDER BY COUNT(DISTINCT fr.recipe_id) DESC) as recipe_rank
FROM fruits f
LEFT JOIN fruit_recipes fr ON f.id = fr.fruit_id
LEFT JOIN queries q ON f.id = q.fruit_id
LEFT JOIN fruit_regions freg ON f.id = freg.fruit_id
GROUP BY f.id, f.common_name
ORDER BY detection_count DESC
;
```

### 9.3 Salud general del catálogo
```sql
SELECT 
    ROUND(COUNT(CASE WHEN f.last_synced_at IS NOT NULL THEN 1 END) / COUNT(*) * 100, 2) as fruits_synced_percent,
    ROUND(COUNT(CASE WHEN f.id IN (SELECT DISTINCT fruit_id FROM fruit_recipes) THEN 1 END) / COUNT(*) * 100, 2) as fruits_with_recipes_percent,
    ROUND(COUNT(CASE WHEN f.id IN (SELECT DISTINCT fruit_id FROM fruit_regions) THEN 1 END) / COUNT(*) * 100, 2) as fruits_with_regions_percent,
    AVG(JSON_LENGTH(f.nutritional, '$')) as avg_nutritional_fields
FROM fruits f
;
```

---

## 10. VIEWS RECOMENDADAS PARA OPTIMIZAR

Estas vistas permitirían consultas más rápidas:

```sql
-- Vista: Resumen de Frutas
CREATE VIEW v_fruit_summary AS
SELECT 
    f.id,
    f.common_name,
    f.slug,
    COUNT(DISTINCT fr.region_id) as region_count,
    COUNT(DISTINCT frec.recipe_id) as recipe_count,
    COUNT(DISTINCT q.id) as detection_count,
    f.last_synced_at,
    f.created_at
FROM fruits f
LEFT JOIN fruit_regions fr ON f.id = fr.fruit_id
LEFT JOIN fruit_recipes frec ON f.id = frec.fruit_id
LEFT JOIN queries q ON f.id = q.fruit_id
GROUP BY f.id, f.common_name, f.slug, f.last_synced_at, f.created_at;

-- Vista: Resumen de Usuarios
CREATE VIEW v_user_summary AS
SELECT 
    u.id,
    u.email,
    u.display_name,
    COUNT(DISTINCT ur.role_id) as role_count,
    GROUP_CONCAT(DISTINCT r.name) as roles,
    u.last_login,
    u.created_at,
    COUNT(DISTINCT q.id) as query_count,
    COUNT(DISTINCT c.id) as contribution_count
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN queries q ON u.id = q.user_id
LEFT JOIN contributions c ON u.id = c.user_id
GROUP BY u.id, u.email, u.display_name, u.last_login, u.created_at;

-- Vista: Resumen de Recetas
CREATE VIEW v_recipe_summary AS
SELECT 
    r.id,
    r.title,
    r.source,
    COUNT(DISTINCT frec.fruit_id) as fruit_count,
    COUNT(DISTINCT rs.id) as step_count,
    MAX(rs.step_number) as max_step_number
FROM recipes r
LEFT JOIN fruit_recipes frec ON r.id = frec.recipe_id
LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
GROUP BY r.id, r.title, r.source;
```

