# 🌐 Configuración de Red Local - FruitExplorer

**IP Configurada**: `192.168.137.141`
**Puerto**: `4000`
**Fecha**: 19 de Noviembre de 2025

---

## 📱 Configuración Aplicada

### 1. Frontend Android (frontend-APP)

#### build.gradle.kts
```kotlin
// Emulador Android
buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:4000/api/\"")

// Dispositivo físico (WiFi)
buildConfigField("String", "API_BASE_URL_DEVICE", "\"http://192.168.137.141:4000/api/\"")
```

#### Constants.java
```java
// Detección automática emulador vs dispositivo físico
public static final String API_BASE_URL = isEmulator()
    ? BuildConfig.API_BASE_URL           // 10.0.2.2:4000
    : BuildConfig.API_BASE_URL_DEVICE;   // 192.168.137.141:4000
```

**Comportamiento**:
- ✅ **En Emulador**: Usa automáticamente `10.0.2.2:4000`
- ✅ **En Dispositivo Físico**: Usa automáticamente `192.168.137.141:4000`

---

### 2. Backend (backend-FruitExplorer)

#### server.js
```javascript
const HOST = '0.0.0.0'; // Escucha en TODAS las interfaces

app.listen(4000, HOST, () => {
  console.log('🚀 Servidor corriendo en:');
  console.log('   - Local:   http://localhost:4000');
  console.log('   - Red:     http://192.168.137.141:4000');
});
```

**Comportamiento**:
- ✅ Acepta conexiones desde `localhost` (desarrollo local)
- ✅ Acepta conexiones desde `192.168.137.141` (red local)
- ✅ Acepta conexiones desde cualquier IP en la misma red WiFi

---

### 3. Frontend Web (frontend-Web)

#### .env
```bash
VITE_API_URL=http://localhost:4000/api
```

**Uso**: Solo para desarrollo en el navegador (localhost)

---

## 🚀 Cómo Usar

### Paso 1: Iniciar el Backend

```bash
cd backend-FruitExplorer
npm run dev
```

**Salida esperada**:
```
🚀 Servidor corriendo en:
   - Local:   http://localhost:4000
   - Red:     http://192.168.137.141:4000
   - API:     http://192.168.137.141:4000/api
   - Docs:    http://192.168.137.141:4000/api-docs
```

### Paso 2: Probar Conectividad

Desde tu computadora:
```bash
# Test 1: Localhost
curl http://localhost:4000/api/health

# Test 2: IP Local
curl http://192.168.137.141:4000/api/health

# Ambos deben responder con status 200
```

Desde tu teléfono (en el navegador):
```
http://192.168.137.141:4000/api/health
```

### Paso 3: Compilar Android App

```bash
cd frontend-APP

# Opción A: Android Studio
# 1. Sync Gradle
# 2. Build > Make Project
# 3. Run en emulador o dispositivo

# Opción B: Línea de comandos
./gradlew assembleDebug
```

### Paso 4: Instalar en Dispositivo

**Emulador**:
- La app usará automáticamente `10.0.2.2:4000`
- No requiere configuración adicional

**Dispositivo Físico**:
1. Conectar el teléfono a la **misma WiFi** que tu computadora
2. Instalar APK
3. La app usará automáticamente `192.168.137.141:4000`

---

## ✅ Verificación de Configuración

### 1. Verificar IP de tu Computadora

**Windows**:
```cmd
ipconfig
```
Buscar "Dirección IPv4" en tu adaptador WiFi, debe ser `192.168.137.141`

**Linux/Mac**:
```bash
ifconfig
# o
ip addr show
```

### 2. Verificar Firewall

**Windows**:
```powershell
# Permitir puerto 4000
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=4000
```

**Linux**:
```bash
# Ubuntu/Debian
sudo ufw allow 4000/tcp

# CentOS/Fedora
sudo firewall-cmd --add-port=4000/tcp --permanent
sudo firewall-cmd --reload
```

### 3. Verificar que el Backend Escucha en 0.0.0.0

```bash
# Linux/Mac
netstat -an | grep 4000

# Windows
netstat -an | findstr 4000
```

Debe mostrar algo como:
```
tcp        0      0 0.0.0.0:4000            0.0.0.0:*               LISTEN
```

Si muestra `127.0.0.1:4000`, el servidor NO acepta conexiones externas.

---

## 🔧 Troubleshooting

### Problema 1: App no puede conectar al servidor

**Síntomas**:
- Error de red en la app Android
- Timeout en requests
- "Sin conexión al servidor"

**Solución**:
1. Verificar que ambos dispositivos están en la **misma WiFi**
2. Hacer ping desde el teléfono:
   ```bash
   # En terminal del teléfono o Termux
   ping 192.168.137.141
   ```
3. Verificar firewall (ver arriba)
4. Verificar que el servidor está corriendo

### Problema 2: Backend solo acepta localhost

**Síntomas**:
- `curl http://localhost:4000` funciona
- `curl http://192.168.137.141:4000` falla

**Solución**:
Verificar que `server.js` tiene:
```javascript
app.listen(PORT, '0.0.0.0', ...)
```

### Problema 3: IP ha cambiado

**Síntomas**:
- Funcionaba antes, ahora no
- Tu IP cambió (DHCP)

**Solución**:
1. Obtener nueva IP: `ipconfig` o `ifconfig`
2. Actualizar `build.gradle.kts`:
   ```kotlin
   buildConfigField("String", "API_BASE_URL_DEVICE", "\"http://NUEVA_IP:4000/api/\"")
   ```
3. Actualizar `Constants.java`:
   ```java
   public static final String API_BASE_URL_LOCAL = "http://NUEVA_IP:4000/api/";
   ```
4. Actualizar `server.js`:
   ```javascript
   console.log(`   - Red:     http://NUEVA_IP:${PORT}`);
   ```
5. Sync Gradle y recompilar

### Problema 4: CORS Error

**Síntomas**:
- Error "Access-Control-Allow-Origin" en navegador
- Requests bloqueados por CORS

**Solución**:
Verificar que `app.js` tiene:
```javascript
app.use(cors()); // Sin restricciones en desarrollo
```

---

## 📊 Arquitectura de Red

```
┌─────────────────┐
│  PC (Desarrollo)│
│  192.168.137.141│
│                 │
│  Backend :4000  │◄──────┐
│  Frontend-Web   │       │
└────────┬────────┘       │
         │                │
         │ WiFi           │ WiFi
         │                │
         │                │
┌────────▼────────┐ ┌─────▼──────────┐
│   Navegador     │ │  Android App   │
│   localhost     │ │  Dispositivo   │
└─────────────────┘ └────────────────┘
```

---

## 🔐 Consideraciones de Seguridad

### Desarrollo Local
- ✅ OK: `0.0.0.0` y CORS sin restricciones
- ✅ Solo en red local (192.168.x.x)
- ✅ No expuesto a Internet

### Producción
- ❌ NO usar `0.0.0.0` sin proxy reverso
- ❌ NO usar CORS sin restricciones
- ✅ Usar HTTPS
- ✅ Configurar CORS específico:
  ```javascript
  app.use(cors({
    origin: 'https://tudominio.com',
    credentials: true
  }));
  ```

---

## 📝 Configuración Recomendada para IP Dinámica

Si tu IP cambia frecuentemente (DHCP), considera usar mDNS:

### Opción 1: IP Estática (Recomendado)

Configurar IP estática en tu router WiFi:
1. Acceder al router (ej: 192.168.1.1)
2. DHCP Settings
3. Reservar IP `192.168.137.141` para tu MAC address

### Opción 2: Usar Hostname (Avanzado)

En lugar de IP, usar hostname:
```kotlin
// build.gradle.kts
buildConfigField("String", "API_BASE_URL_DEVICE", "\"http://tu-pc.local:4000/api/\"")
```

Requiere configurar mDNS/Bonjour en tu PC.

---

## 🧪 Testing de Conectividad

### Test Rápido desde Android

Agregar este código en cualquier Activity:

```java
import com.fruitexplorer.api.ApiClient;

// En onCreate() o algún botón
ApiClient.checkServerHealth(this, new ApiClient.HealthCheckCallback() {
    @Override
    public void onSuccess() {
        Log.i("Test", "✅ Conectado a " + ApiClient.getBaseUrl());
        Toast.makeText(this, "Servidor online!", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onError(String message) {
        Log.e("Test", "❌ Error: " + message);
        Toast.makeText(this, "Error: " + message, Toast.LENGTH_LONG).show();
    }
});
```

---

## 📚 Archivos Modificados

| Archivo | Cambio | IP Anterior | IP Nueva |
|---------|--------|-------------|----------|
| `frontend-APP/app/build.gradle.kts` | buildConfigField | 192.168.0.100 | 192.168.137.141 |
| `frontend-APP/.../Constants.java` | API_BASE_URL_LOCAL | 192.168.0.100 | 192.168.137.141 |
| `backend-FruitExplorer/src/server.js` | HOST + logs | localhost | 0.0.0.0 + logs |

---

**Última Actualización**: 19 de Noviembre de 2025
**Configurado por**: Claude AI Assistant
**IP Local**: 192.168.137.141
**Puerto**: 4000
