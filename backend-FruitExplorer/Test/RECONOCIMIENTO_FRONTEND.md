# 🔍 Frontend - Reconocimiento de Frutas con IA

## Descripción

Interfaz web moderna y responsiva para reconocer frutas usando IA (OpenAI GPT-4 Vision). Permite a los usuarios subir imágenes de frutas y recibir información detallada sobre ellas, incluyendo nombre, madurez, color y datos nutricionales.

## 🎯 Características

### ✅ Funcionalidades Implementadas

- **📸 Subida de Imágenes**
  - Drag & drop o selección de archivos
  - Vista previa de la imagen
  - Validación de formato y tamaño
  - Máximo 5MB por imagen

- **🤖 Reconocimiento con IA**
  - Identificación de frutas en tiempo real
  - Detección de estado de madurez
  - Análisis de color predominante
  - Nombre común y científico

- **🍎 Información Nutricional**
  - Calorías y macronutrientes
  - Vitaminas y minerales principales
  - Beneficios para la salud
  - Carga automática después del reconocimiento

- **🎨 Interfaz Atractiva**
  - Diseño moderno y limpio
  - Animaciones suaves
  - Responsive para móviles
  - Indicadores de confianza visuales

## 📁 Estructura de Archivos

```
frontend-Web/src/
├── pages/
│   └── FruitRecognition.jsx    # Página principal
├── services/
│   └── recognitionService.js   # API calls
├── App.jsx                      # Rutas actualizadas
└── App.css                      # Estilos CSS
```

## 🚀 Cómo Usar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd backend-FruitExplorer
npm run dev
```

**Importante:** Configura tu `OPENAI_API_KEY` en el archivo `.env` del backend.

### 2. Inicia el frontend

```bash
cd frontend-Web
npm run dev
```

### 3. Accede a la aplicación

Abre tu navegador en: **http://localhost:5173/recognition**

### 4. Usa el reconocimiento

1. **Haz clic** en el área de carga o **arrastra** una imagen
2. Selecciona una foto clara de una fruta
3. Haz clic en **"🔍 Reconocer Fruta"**
4. Espera unos segundos mientras la IA analiza
5. ¡Recibe información detallada!

## 📸 Capturas de Pantalla (Descripción)

### Vista Inicial
- Área de carga con borde punteado
- Icono de cámara grande
- Instrucciones claras

### Con Imagen Cargada
- Preview de la imagen seleccionada
- Botón "Reconocer Fruta" prominente
- Botón para cambiar imagen

### Resultado - Fruta Detectada
- Tarjeta verde con checkmark
- Badge de nivel de confianza (alta/media/baja)
- Información organizada en tarjetas:
  - Nombre común
  - Nombre científico (italic)
  - Color predominante (con indicador visual)
  - Estado de madurez (con emoji)
  - Descripción detallada

### Información Nutricional
- Tarjeta azul separada
- Grid de macronutrientes
- Listas de vitaminas y minerales
- Beneficios para la salud con checkmarks

### Resultado - No es Fruta
- Tarjeta roja
- Mensaje claro de error
- Descripción de lo que se detectó

## 🎨 Paleta de Colores

```css
--primary: #0a3d62         /* Azul oscuro */
--accent: #1e90ff          /* Azul brillante */
--success: #2ecc71         /* Verde éxito */
--danger: #e74c3c          /* Rojo error */
--text-dark: #2c3e50       /* Texto principal */
--text-light: #67727e      /* Texto secundario */
```

## 🔧 Componentes Principales

### FruitRecognition.jsx

**Estados:**
- `selectedImage` - Archivo de imagen seleccionado
- `imagePreview` - URL de preview
- `loading` - Estado de carga del reconocimiento
- `result` - Resultado del reconocimiento
- `nutritionInfo` - Información nutricional
- `error` - Mensajes de error

**Funciones:**
- `handleImageSelect()` - Maneja selección y validación de imagen
- `handleRecognize()` - Envía imagen a la API para reconocimiento
- `loadNutritionalInfo()` - Carga datos nutricionales
- `handleReset()` - Limpia y permite nueva imagen

### recognitionService.js

**Funciones:**
- `recognizeFruit(imageFile)` - Reconoce fruta (público)
- `recognizeFruitAuth(imageFile, token)` - Reconoce fruta (con auth)
- `getNutritionalInfo(fruitName)` - Obtiene info nutricional

## 📱 Responsive Design

### Desktop (> 768px)
- Grid de 2-3 columnas para información
- Imágenes hasta 600px de ancho
- Layout horizontal

### Tablet (768px)
- Grid de 2 columnas
- Elementos apilados

### Mobile (< 768px)
- Todo en 1 columna
- Imágenes optimizadas
- Botones full-width

## ⚠️ Manejo de Errores

### Validaciones Implementadas

1. **Tipo de archivo inválido**
   ```
   "Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)."
   ```

2. **Tamaño excedido**
   ```
   "La imagen es muy grande. El tamaño máximo es 5MB."
   ```

3. **No se seleccionó imagen**
   ```
   "Por favor selecciona una imagen primero."
   ```

4. **Error de conexión**
   ```
   "Error al conectar con el servidor."
   ```

5. **API Key inválida**
   ```
   Se muestra el error del backend
   ```

## 🎯 Flujo de Usuario

```
1. Usuario visita /recognition
   ↓
2. Ve área de carga vacía
   ↓
3. Selecciona imagen (click o drag)
   ↓
4. Sistema valida imagen
   ├─ ✅ Válida → Muestra preview
   └─ ❌ Inválida → Muestra error
   ↓
5. Usuario hace click en "Reconocer"
   ↓
6. Muestra "Analizando..."
   ↓
7. Backend procesa con OpenAI
   ↓
8. Muestra resultado
   ├─ ✅ Es fruta
   │   ├─ Información básica
   │   └─ Carga info nutricional
   └─ ❌ No es fruta
       └─ Mensaje explicativo
   ↓
9. Usuario puede analizar otra imagen
```

## 🧪 Pruebas

### Casos de Prueba Sugeridos

1. **Fruta clara y centrada**
   - Foto de una manzana roja sobre fondo blanco
   - Resultado esperado: Alta confianza, información completa

2. **Fruta en estado verde**
   - Foto de un plátano verde
   - Resultado esperado: Detecta madurez "verde"

3. **Fruta muy madura**
   - Foto de un aguacate muy maduro
   - Resultado esperado: Detecta "muy maduro"

4. **Múltiples frutas**
   - Foto de un bowl con varias frutas
   - Resultado esperado: Identifica la principal o avisa

5. **No es fruta**
   - Foto de un automóvil
   - Resultado esperado: "No es una fruta"

6. **Imagen borrosa**
   - Foto desenfocada
   - Resultado esperado: Baja confianza o no detecta

## 🔗 Integración con Backend

### Endpoints Usados

```javascript
// Reconocimiento público
POST http://localhost:4000/api/recognition/fruit
Content-Type: multipart/form-data

// Información nutricional
POST http://localhost:4000/api/recognition/nutrition
Content-Type: application/json
Body: { "nombreFruta": "Manzana" }
```

### Formato de Respuesta

```javascript
{
  "exito": true,
  "resultado": {
    "es_fruta": true,
    "nombre_comun": "Manzana",
    "nombre_cientifico": "Malus domestica",
    "color_predominante": "rojo",
    "estado_madurez": "maduro",
    "confianza": "alta",
    "descripcion": "..."
  },
  "metadata": {
    "modelo": "gpt-4o-mini",
    "tokens_usados": 245,
    "timestamp": "2025-01-19T10:30:00.000Z"
  }
}
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `App.css`:

```css
:root {
  --primary: #tu-color-aqui;
  --accent: #tu-color-aqui;
  /* etc... */
}
```

### Cambiar Tamaño Máximo de Imagen

Edita en `FruitRecognition.jsx`:

```javascript
// Cambiar de 5MB a otro valor
if (file.size > 10 * 1024 * 1024) { // 10MB
  setError("La imagen es muy grande...");
}
```

### Modificar Mensajes

Todos los textos están en español y pueden ser modificados directamente en el componente.

## 📊 Métricas de Uso

Para implementar analytics, puedes agregar tracking en:

1. Cuando se sube una imagen
2. Cuando se completa un reconocimiento
3. Cuando falla un reconocimiento
4. Tiempo promedio de análisis

Ejemplo con Google Analytics:

```javascript
// En handleRecognize()
gtag('event', 'fruit_recognition', {
  'event_category': 'AI',
  'event_label': result.nombre_comun,
  'confidence': result.confianza
});
```

## 🐛 Troubleshooting

### La imagen no se carga

**Problema:** El preview no aparece
**Solución:** Verifica que FileReader esté soportado en tu navegador

### El botón "Reconocer" está deshabilitado

**Problema:** No puedes hacer click
**Solución:** Verifica que hayas seleccionado una imagen válida

### Error "Network Error"

**Problema:** No se puede conectar al backend
**Solución:** Verifica que el backend esté corriendo en http://localhost:4000

### "Error de autenticación con OpenAI"

**Problema:** API Key inválida
**Solución:** Verifica `OPENAI_API_KEY` en `.env` del backend

### La información nutricional no aparece

**Problema:** Se reconoce la fruta pero no hay datos nutricionales
**Solución:** Esto es normal, el endpoint nutricional puede tardar o fallar independientemente

## 🚀 Mejoras Futuras

### Ideas para Implementar

1. **Historial de Reconocimientos**
   - Guardar reconocimientos previos
   - Ver historial en página dedicada

2. **Comparación de Frutas**
   - Subir dos imágenes
   - Comparar información nutricional

3. **Compartir Resultados**
   - Botón para compartir en redes sociales
   - Generar imagen con resultado

4. **Modo Cámara**
   - Acceder a la cámara del dispositivo
   - Tomar foto directamente

5. **Guardar Favoritos**
   - Marcar frutas favoritas
   - Lista personalizada

6. **Modo Offline**
   - Cache de resultados comunes
   - Service Worker

7. **Gamificación**
   - Puntos por reconocimientos
   - Logros y badges

8. **Búsqueda Avanzada**
   - Buscar frutas similares en el catálogo
   - Sugerir recetas con la fruta detectada

## 📚 Referencias

- **OpenAI Vision API:** https://platform.openai.com/docs/guides/vision
- **React File Upload:** https://react.dev/reference/react-dom/components/input#reading-the-files-information-without-uploading-them-to-the-server
- **FormData API:** https://developer.mozilla.org/en-US/docs/Web/API/FormData

## 📝 Notas Técnicas

- Los archivos se envían como `multipart/form-data`
- Las imágenes se convierten a Base64 en el backend
- El reconocimiento es asíncrono con indicador de carga
- Los estilos usan CSS Grid para layouts responsivos
- Las animaciones usan CSS transitions y @keyframes

## 🤝 Contribuir

Para agregar nuevas características:

1. Crea un nuevo branch
2. Implementa tu feature
3. Añade tests si es necesario
4. Actualiza esta documentación
5. Crea un Pull Request

---

**Desarrollado con ❤️ para FruitExplorer**
