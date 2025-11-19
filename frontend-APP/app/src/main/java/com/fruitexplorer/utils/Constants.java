package com.fruitexplorer.utils;

import com.fruitexplorer.BuildConfig;

public class Constants {
    /**
     * URL base de la API
     * Configurada desde BuildConfig (build.gradle.kts)
     *
     * - Desarrollo: http://192.168.137.141:4000/api/
     * - Producción: https://fruitexplorer-api.com/api/
     */
    public static final String API_BASE_URL = BuildConfig.API_BASE_URL;

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
     * Método helper para obtener la URL de la API
     * @return URL base de la API configurada en BuildConfig
     */
    public static String getApiUrl() {
        return API_BASE_URL;
    }
}
