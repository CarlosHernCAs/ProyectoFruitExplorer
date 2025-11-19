# 🔑 Cómo Obtener tu API Key de Google Gemini (GRATIS)

## 🆓 Ventajas de Gemini

- ✅ **Completamente GRATIS** para uso básico
- ✅ **Sin tarjeta de crédito** requerida
- ✅ **15 solicitudes por minuto** gratis
- ✅ **1,500 solicitudes por día** gratis
- ✅ **Rápido y preciso** para reconocimiento de imágenes

---

## 📝 Pasos para Obtener tu API Key

### 1. Accede a Google AI Studio

Visita: **https://aistudio.google.com/app/apikey**

### 2. Inicia Sesión

- Usa tu cuenta de Google (Gmail)
- Si no tienes una, créala gratis

### 3. Crea una API Key

1. Haz clic en **"Get API Key"** o **"Create API Key"**
2. Selecciona **"Create API key in new project"**
3. Espera unos segundos mientras se crea
4. ¡Listo! Tu API key se mostrará en pantalla

### 4. Copia tu API Key

Tu API key tendrá este formato:
```
AIzaSy... (39 caracteres)
```

**IMPORTANTE:** Copia toda la clave completa

### 5. Configura en tu Proyecto

Abre el archivo `.env` en `backend-FruitExplorer/` y pega tu clave:

```env
GEMINI_API_KEY=AIzaSy_tu_clave_completa_aqui
```

### 6. Guarda y Reinicia el Servidor

```bash
# Detén el servidor (Ctrl + C)
# Reinicia:
npm run dev
```

---

## ✅ Verificar que Funciona

Prueba el endpoint de información nutricional:

```bash
curl -X POST http://localhost:4000/api/recognition/nutrition \
  -H "Content-Type: application/json" \
  -d "{\"nombreFruta\": \"Manzana\"}"
```

**Respuesta esperada:**
```json
{
  "exito": true,
  "resultado": {
    "nombre": "Manzana",
    "calorias": 52,
    ...
  }
}
```

---

## 🔒 Seguridad de tu API Key

### ✅ Hacer:
- Guardar la clave en el archivo `.env`
- Añadir `.env` al `.gitignore`
- Nunca compartir la clave públicamente

### ❌ NO Hacer:
- Subir la clave a GitHub/Git
- Compartir la clave en screenshots
- Incluir la clave en el código fuente

---

## 📊 Límites del Plan Gratuito

| Límite | Cantidad |
|--------|----------|
| Solicitudes por minuto (RPM) | 15 |
| Tokens por minuto (TPM) | 1,000,000 |
| Solicitudes por día (RPD) | 1,500 |

**Nota:** Estos límites son más que suficientes para desarrollo y aplicaciones pequeñas/medianas.

---

## 💡 Si Excedes los Límites

### Síntoma:
Error 429: "Límite de solicitudes excedido"

### Solución:
1. **Espera 1 minuto** - Los límites se resetean cada minuto
2. **Implementa Rate Limiting** en tu aplicación
3. **Usa caché** para resultados comunes
4. **Considera upgrade** si necesitas más (planes pagos muy económicos)

---

## 🆙 Planes Pagos (Opcional)

Si necesitas más capacidad:

- **Pay-as-you-go:** Solo pagas lo que usas
- **Precios bajos:** ~$0.35 por 1M tokens de entrada
- **Sin mínimos:** No hay compromiso mensual

Más info: https://ai.google.dev/pricing

---

## 🤔 Troubleshooting

### "API key not valid"

**Problema:** La clave no es válida
**Solución:**
1. Verifica que copiaste la clave completa
2. No debe tener espacios al inicio o final
3. Revisa que empiece con `AIzaSy`

### "The server returned a 403"

**Problema:** La API no está habilitada
**Solución:**
1. Asegúrate de estar en https://aistudio.google.com/app/apikey
2. Crea una nueva API key
3. Espera 1-2 minutos para que se active

### "The server returned a 400"

**Problema:** Request mal formado
**Solución:**
1. Verifica que la imagen esté en base64
2. Comprueba el formato del prompt
3. Revisa los logs del servidor para más detalles

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://ai.google.dev/docs
- **Google AI Studio:** https://aistudio.google.com/
- **Pricing:** https://ai.google.dev/pricing
- **Ejemplos:** https://ai.google.dev/examples

---

## 🎉 ¡Listo!

Ahora tienes todo configurado para usar el reconocimiento de frutas con IA de forma **gratuita** y sin límites de desarrollo.

**Siguiente paso:** Prueba subiendo una imagen de fruta en el frontend: http://localhost:5173/recognition

¿Problemas? Revisa el archivo `RECONOCIMIENTO_FRUTAS.md` para más ayuda.
