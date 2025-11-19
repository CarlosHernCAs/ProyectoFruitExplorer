# 🍎 API de Reconocimiento de Frutas con Google Gemini Vision

## Descripción

Esta API permite reconocer frutas desde imágenes utilizando Google Gemini 1.5 Flash (Vision). También proporciona información nutricional detallada sobre frutas.

## 🆓 ¿Por qué Gemini?

- **GRATIS**: Gemini ofrece un tier gratuito generoso (15 solicitudes por minuto)
- **Rápido**: Gemini 1.5 Flash es ultra rápido
- **Preciso**: Excelente reconocimiento de imágenes
- **Sin tarjeta**: No requiere tarjeta de crédito para empezar

## Configuración

### 1. Instalar dependencias

Las dependencias ya están instaladas si ejecutaste `npm install`. Las necesarias son:

- `@google/generative-ai` - Cliente oficial de Google Gemini
- `multer` - Manejo de subida de archivos multipart/form-data

### 2. Configurar la API Key de Gemini

1. **Obtén tu API key GRATIS** en: https://aistudio.google.com/app/apikey
   - No requiere tarjeta de crédito
   - Límite gratuito: 15 solicitudes/minuto
   - Ideal para desarrollo y producción pequeña

2. Edita el archivo `.env` y agrega tu clave:

```env
GEMINI_API_KEY=AIzaSy_tu_clave_aqui
```

⚠️ **IMPORTANTE**: Nunca compartas tu API key públicamente ni la subas a repositorios Git.

## Endpoints Disponibles

### 1. Reconocer Fruta desde Imagen

**Endpoint:** `POST /api/recognition/fruit`

**Descripción:** Analiza una imagen y determina si contiene una fruta, proporcionando información detallada sobre ella.

**Content-Type:** `multipart/form-data`

**Parámetros:**
- `imagen` (archivo) - Imagen de la fruta a analizar

**Formatos soportados:**
- JPEG / JPG
- PNG
- GIF
- WEBP

**Tamaño máximo:** 5MB

**Ejemplo de uso con cURL:**

```bash
curl -X POST http://localhost:4000/api/recognition/fruit \
  -F "imagen=@/ruta/a/tu/imagen.jpg"
```

**Ejemplo con JavaScript (Fetch):**

```javascript
const formData = new FormData();
formData.append('imagen', archivoImagen);

const response = await fetch('http://localhost:4000/api/recognition/fruit', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

**Respuesta exitosa (200):**

```json
{
  "exito": true,
  "resultado": {
    "es_fruta": true,
    "nombre_comun": "Manzana",
    "nombre_cientifico": "Malus domestica",
    "color_predominante": "rojo",
    "estado_madurez": "maduro",
    "confianza": "alta",
    "descripcion": "Una manzana roja brillante que parece estar madura y lista para consumir"
  },
  "metadata": {
    "modelo": "gemini-2.5-flash",
    "proveedor": "Google Gemini",
    "timestamp": "2025-01-19T10:30:00.000Z"
  }
}
```

**Respuesta cuando NO es una fruta:**

```json
{
  "exito": true,
  "resultado": {
    "es_fruta": false,
    "descripcion": "La imagen muestra un automóvil rojo en una calle"
  },
  "metadata": {
    "modelo": "gemini-2.5-flash",
    "proveedor": "Google Gemini",
    "timestamp": "2025-01-19T10:30:00.000Z"
  }
}
```

**Errores posibles:**

```json
// No se subió imagen (400)
{
  "error": "No se ha subido ninguna imagen.",
  "mensaje": "Por favor, proporciona una imagen para analizar."
}

// Tipo de archivo inválido (400)
{
  "error": "Error de validación",
  "mensaje": "Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)."
}

// Archivo muy grande (400)
{
  "error": "Archivo demasiado grande",
  "mensaje": "El tamaño máximo permitido es 5MB."
}

// Error de Gemini API (500)
{
  "error": "Error de autenticación con Google Gemini",
  "mensaje": "La clave API de Gemini no es válida o ha expirado."
}

// Límite de solicitudes excedido (429)
{
  "error": "Límite de solicitudes excedido",
  "mensaje": "Has alcanzado el límite de solicitudes de la API de Gemini."
}
```

---

### 2. Obtener Información Nutricional

**Endpoint:** `POST /api/recognition/nutrition`

**Descripción:** Obtiene información nutricional detallada sobre una fruta específica.

**Content-Type:** `application/json`

**Body:**

```json
{
  "nombreFruta": "Manzana"
}
```

**Ejemplo con cURL:**

```bash
curl -X POST http://localhost:4000/api/recognition/nutrition \
  -H "Content-Type: application/json" \
  -d '{"nombreFruta": "Manzana"}'
```

**Ejemplo con JavaScript:**

```javascript
const response = await fetch('http://localhost:4000/api/recognition/nutrition', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombreFruta: 'Manzana'
  })
});

const data = await response.json();
console.log(data);
```

**Respuesta exitosa (200):**

```json
{
  "exito": true,
  "resultado": {
    "nombre": "Manzana",
    "porcion": "100g",
    "calorias": 52,
    "carbohidratos": "14g",
    "proteinas": "0.3g",
    "grasas": "0.2g",
    "fibra": "2.4g",
    "vitaminas_principales": [
      "Vitamina C",
      "Vitamina K",
      "Vitamina B6"
    ],
    "minerales_principales": [
      "Potasio",
      "Calcio",
      "Magnesio"
    ],
    "beneficios": [
      "Mejora la salud cardiovascular",
      "Ayuda a controlar el peso",
      "Fortalece el sistema inmunológico"
    ]
  }
}
```

---

### 3. Reconocimiento Autenticado (Requiere Token)

**Endpoint:** `POST /api/recognition/fruit/auth`

**Descripción:** Igual que `/fruit` pero requiere autenticación mediante JWT.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Ejemplo:**

```javascript
const formData = new FormData();
formData.append('imagen', archivoImagen);

const response = await fetch('http://localhost:4000/api/recognition/fruit/auth', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## Ejemplo de Integración en Frontend

### React Example

```jsx
import { useState } from 'react';

function FruitRecognition() {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleImageUpload = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);
    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const response = await fetch('http://localhost:4000/api/recognition/fruit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResultado(data.resultado);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2>Reconocimiento de Frutas</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={cargando}
      />

      {cargando && <p>Analizando imagen...</p>}

      {resultado && resultado.es_fruta && (
        <div>
          <h3>Resultado:</h3>
          <p><strong>Fruta:</strong> {resultado.nombre_comun}</p>
          <p><strong>Nombre científico:</strong> {resultado.nombre_cientifico}</p>
          <p><strong>Color:</strong> {resultado.color_predominante}</p>
          <p><strong>Madurez:</strong> {resultado.estado_madurez}</p>
          <p><strong>Descripción:</strong> {resultado.descripcion}</p>
        </div>
      )}

      {resultado && !resultado.es_fruta && (
        <p>No se detectó una fruta en la imagen: {resultado.descripcion}</p>
      )}
    </div>
  );
}
```

---

## Costos y Límites

### Google Gemini 2.5 Flash (GRATIS!)

- **Modelo:** `gemini-2.5-flash` (multimodal: soporta imágenes y texto)
- **Costo:** **¡GRATIS!** hasta 15 solicitudes por minuto
- **Límite gratuito:**
  - 15 requests/minuto (RPM)
  - 1 millón de tokens/minuto (TPM)
  - 1,500 requests/día (RPD)
- **Costo estimado por petición:** **$0.00 USD** (en tier gratuito)
- **Ideal para:** Desarrollo, MVPs, aplicaciones pequeñas y medianas

### Límites de Multer

- **Tamaño máximo de archivo:** 5MB
- **Formatos permitidos:** JPEG, PNG, GIF, WEBP

---

## Troubleshooting

### Error: "Error de autenticación con Google Gemini"

**Solución:** Verifica que tu `GEMINI_API_KEY` en el archivo `.env` sea válida. Obtén una gratis en https://aistudio.google.com/app/apikey

### Error 429: "Límite de solicitudes excedido"

**Solución:** Has excedido el límite de 15 solicitudes por minuto o 1,500 por día. Espera un minuto e intenta de nuevo. El límite se resetea automáticamente.

### Error 400: "Tipo de archivo no válido"

**Solución:** Asegúrate de subir una imagen en formato JPEG, PNG, GIF o WEBP.

### La respuesta no es JSON válido

**Solución:** El controlador ya maneja esto automáticamente intentando extraer JSON del texto. Si persiste, revisa los logs del servidor.

---

## Mejoras Futuras

- [ ] Almacenar historial de reconocimientos en la base de datos
- [ ] Añadir cache de respuestas para imágenes similares
- [ ] Implementar reconocimiento de múltiples frutas en una imagen
- [ ] Añadir soporte para reconocimiento de calidad/defectos
- [ ] Integrar con el catálogo de frutas existente para sugerir matches
- [ ] Dashboard de estadísticas de uso de la API

---

## Seguridad

⚠️ **Recomendaciones:**

1. **Rate Limiting:** Implementa límites de solicitudes por IP/usuario
2. **Validación de Imágenes:** El middleware ya valida tipos y tamaños
3. **API Key:** Nunca expongas la API key de Gemini en el frontend
4. **CORS:** Configura CORS apropiadamente para producción
5. **Costos:** Monitorea el uso de la API de Gemini aunque sea gratuita

---

## Testing

### Probar con Postman

1. Abre Postman
2. Crea una nueva petición POST
3. URL: `http://localhost:4000/api/recognition/fruit`
4. En la pestaña "Body", selecciona "form-data"
5. Agrega una clave llamada `imagen` y selecciona "File"
6. Sube una imagen de una fruta
7. Envía la petición

### Probar con cURL

```bash
# Reconocimiento de fruta
curl -X POST http://localhost:4000/api/recognition/fruit \
  -F "imagen=@manzana.jpg"

# Información nutricional
curl -X POST http://localhost:4000/api/recognition/nutrition \
  -H "Content-Type: application/json" \
  -d '{"nombreFruta": "Manzana"}'
```

---

## Soporte

Para preguntas o problemas, consulta:
- Documentación de Google Gemini: https://ai.google.dev/docs
- Guía de Rate Limits: https://ai.google.dev/gemini-api/docs/rate-limits
- Documentación de Multer: https://github.com/expressjs/multer
