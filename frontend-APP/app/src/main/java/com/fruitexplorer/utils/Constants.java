package com.fruitexplorer.utils;

import android.os.Build;

import com.fruitexplorer.BuildConfig;

public class Constants {
    /**
     * Detecta automáticamente si la app está corriendo en un emulador o dispositivo físico
     * y devuelve la URL apropiada.
     *
     * - Emulador: usa 10.0.2.2 (localhost del host)
     * - Dispositivo físico: usa la IP de tu red local configurada en BuildConfig
     */
    public static final String API_BASE_URL = isEmulator()
            ? BuildConfig.API_BASE_URL
            : BuildConfig.API_BASE_URL_DEVICE;

    /**
     * Detecta si la app está corriendo en un emulador Android
     */
    private static boolean isEmulator() {
        return Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || (Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic"))
                || "google_sdk".equals(Build.PRODUCT);
    }

    /**
     * URL base para desarrollo local (emulador)
     * 10.0.2.2 es el localhost del host machine desde el emulador Android
     */
    public static final String API_BASE_URL_EMULATOR = "http://10.0.2.2:4000/api/";

    /**
     * URL base para desarrollo local (dispositivo físico)
     * Cambia esta IP a la IP local de tu computadora en la red WiFi
     * Ejemplo: En Windows/Linux ejecuta: ipconfig o ifconfig
     */
    public static final String API_BASE_URL_LOCAL = "http://192.168.0.100:4000/api/";

    /**
     * URL base para producción
     */
    public static final String API_BASE_URL_PRODUCTION = "https://fruitexplorer-api.com/api/";

    // Configuración de tiempos de espera
    public static final int CONNECT_TIMEOUT = 30; // segundos
    public static final int READ_TIMEOUT = 30; // segundos
    public static final int WRITE_TIMEOUT = 30; // segundos

    // Claves de preferencias compartidas
    public static final String PREF_NAME = "FruitExplorerPrefs";
    public static final String KEY_TOKEN = "token";
    public static final String KEY_USER_ID = "user_id";
    public static final String KEY_USER_EMAIL = "user_email";
    public static final String KEY_USER_NAME = "user_name";
    public static final String KEY_IS_LOGGED_IN = "is_logged_in";

    // Mensajes de error comunes
    public static final String ERROR_NETWORK = "Error de conexión. Verifica tu internet.";
    public static final String ERROR_SERVER = "Error del servidor. Intenta más tarde.";
    public static final String ERROR_UNKNOWN = "Error desconocido. Intenta nuevamente.";
    public static final String ERROR_NO_INTERNET = "Sin conexión a internet";

    /**
     * Método helper para obtener la URL correcta según el entorno
     */
    public static String getApiUrl() {
        if (BuildConfig.DEBUG) {
            // En modo debug, auto-detecta emulador vs dispositivo
            return isEmulator() ? API_BASE_URL_EMULATOR : API_BASE_URL_LOCAL;
        } else {
            // En producción, usa la URL de producción
            return API_BASE_URL_PRODUCTION;
        }
    }
}
