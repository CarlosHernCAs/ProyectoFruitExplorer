package com.fruitexplorer.utils;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.fruitexplorer.activities.LoginActivity;
import com.fruitexplorer.models.User;

/**
 * SessionManager mejorado para manejar la sesión del usuario
 * Características:
 * - Almacenamiento seguro de token y datos de usuario
 * - Validación de sesión
 * - Métodos helper para acceder a datos del usuario
 * - Logging para debugging
 * - Optimización de performance con apply()
 */
public class SessionManager {
    private static final String TAG = "SessionManager";

    // Nombre de las SharedPreferences (usando constante de Constants)
    private static final String PREF_NAME = Constants.PREF_NAME;

    // Claves para SharedPreferences (usando constantes de Constants)
    private static final String KEY_IS_LOGGED_IN = Constants.KEY_IS_LOGGED_IN;
    private static final String KEY_AUTH_TOKEN = Constants.KEY_TOKEN;
    private static final String KEY_USER_ID = Constants.KEY_USER_ID;
    private static final String KEY_USER_EMAIL = Constants.KEY_USER_EMAIL;
    private static final String KEY_USER_NAME = Constants.KEY_USER_NAME;
    private static final String KEY_HAS_SEEN_WELCOME = "hasSeenWelcome";

    // Nueva clave para timestamp de login
    private static final String KEY_LOGIN_TIMESTAMP = "loginTimestamp";
    private static final long SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000L; // 30 días en milisegundos

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private Context context;

    /**
     * Constructor del SessionManager
     */
    public SessionManager(Context context) {
        this.context = context;
        this.sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        this.editor = sharedPreferences.edit();
        Log.d(TAG, "SessionManager inicializado");
    }

    /**
     * Crea una nueva sesión de login guardando token y datos del usuario
     */
    public void createLoginSession(String token, User user) {
        if (token == null || token.isEmpty()) {
            Log.e(TAG, "Error: Token vacío al crear sesión");
            return;
        }

        if (user == null) {
            Log.e(TAG, "Error: Usuario nulo al crear sesión");
            return;
        }

        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_AUTH_TOKEN, token);
        editor.putString(KEY_USER_ID, user.getId());
        editor.putString(KEY_USER_EMAIL, user.getEmail());
        editor.putString(KEY_USER_NAME, user.getDisplayName());
        editor.putLong(KEY_LOGIN_TIMESTAMP, System.currentTimeMillis());
        editor.apply(); // Usar apply() en lugar de commit() para mejor performance

        Log.i(TAG, "✅ Sesión creada para usuario: " + user.getEmail());
        logSessionInfo();
    }

    /**
     * Obtiene el token de autenticación
     */
    public String getToken() {
        String token = sharedPreferences.getString(KEY_AUTH_TOKEN, null);
        if (token == null) {
            Log.w(TAG, "⚠️ Token no encontrado");
        }
        return token;
    }

    /**
     * Obtiene el ID del usuario
     */
    public String getUserId() {
        return sharedPreferences.getString(KEY_USER_ID, null);
    }

    /**
     * Obtiene el email del usuario
     */
    public String getUserEmail() {
        return sharedPreferences.getString(KEY_USER_EMAIL, "");
    }

    /**
     * Obtiene el nombre para mostrar del usuario
     */
    public String getUserDisplayName() {
        return sharedPreferences.getString(KEY_USER_NAME, "Usuario");
    }

    /**
     * Obtiene un objeto User con los datos almacenados
     */
    public User getUser() {
        if (!isLoggedIn()) {
            return null;
        }

        User user = new User();
        user.setId(getUserId());
        user.setEmail(getUserEmail());
        user.setDisplayName(getUserDisplayName());
        return user;
    }

    /**
     * Verifica si hay una sesión activa válida
     */
    public boolean isLoggedIn() {
        boolean isLoggedIn = sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false);

        if (!isLoggedIn) {
            return false;
        }

        // Verificar si la sesión ha expirado
        if (isSessionExpired()) {
            Log.w(TAG, "⚠️ Sesión expirada");
            logoutUser();
            return false;
        }

        return true;
    }

    /**
     * Verifica si la sesión ha expirado
     */
    private boolean isSessionExpired() {
        long loginTimestamp = sharedPreferences.getLong(KEY_LOGIN_TIMESTAMP, 0);
        if (loginTimestamp == 0) {
            return false; // Si no hay timestamp, asumimos que es una sesión vieja, no expiramos
        }

        long currentTime = System.currentTimeMillis();
        long sessionDuration = currentTime - loginTimestamp;

        return sessionDuration > SESSION_TIMEOUT;
    }

    /**
     * Cierra la sesión del usuario
     */
    public void logoutUser() {
        Log.i(TAG, "🚪 Cerrando sesión de usuario: " + getUserEmail());

        editor.clear();
        editor.apply();

        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    /**
     * Actualiza solo el token (útil para refresh token)
     */
    public void updateToken(String newToken) {
        if (newToken != null && !newToken.isEmpty()) {
            editor.putString(KEY_AUTH_TOKEN, newToken);
            editor.putLong(KEY_LOGIN_TIMESTAMP, System.currentTimeMillis()); // Resetear timestamp
            editor.apply();
            Log.d(TAG, "Token actualizado");
        }
    }

    /**
     * Actualiza los datos del usuario
     */
    public void updateUserData(User user) {
        if (user != null) {
            if (user.getId() != null) {
                editor.putString(KEY_USER_ID, user.getId());
            }
            if (user.getEmail() != null) {
                editor.putString(KEY_USER_EMAIL, user.getEmail());
            }
            if (user.getDisplayName() != null) {
                editor.putString(KEY_USER_NAME, user.getDisplayName());
            }
            editor.apply();
            Log.d(TAG, "Datos de usuario actualizados");
        }
    }

    /**
     * Marca que el usuario ya vio la pantalla de bienvenida
     */
    public void setWelcomeScreenSeen() {
        editor.putBoolean(KEY_HAS_SEEN_WELCOME, true);
        editor.apply();
        Log.d(TAG, "Pantalla de bienvenida marcada como vista");
    }

    /**
     * Verifica si el usuario ya vio la pantalla de bienvenida
     */
    public boolean hasSeenWelcomeScreen() {
        return sharedPreferences.getBoolean(KEY_HAS_SEEN_WELCOME, false);
    }

    /**
     * Limpia solo los datos de sesión pero mantiene preferencias
     */
    public void clearSession() {
        editor.remove(KEY_IS_LOGGED_IN);
        editor.remove(KEY_AUTH_TOKEN);
        editor.remove(KEY_USER_ID);
        editor.remove(KEY_USER_EMAIL);
        editor.remove(KEY_USER_NAME);
        editor.remove(KEY_LOGIN_TIMESTAMP);
        editor.apply();
        Log.d(TAG, "Sesión limpiada (preferencias mantenidas)");
    }

    /**
     * Limpia todas las preferencias (reset completo)
     */
    public void clearAll() {
        editor.clear();
        editor.apply();
        Log.d(TAG, "Todas las preferencias limpiadas");
    }

    /**
     * Método helper para debugging - muestra info de la sesión
     */
    private void logSessionInfo() {
        Log.d(TAG, "═══════════════════════════════════");
        Log.d(TAG, "Información de Sesión:");
        Log.d(TAG, "  - Usuario ID: " + getUserId());
        Log.d(TAG, "  - Email: " + getUserEmail());
        Log.d(TAG, "  - Nombre: " + getUserDisplayName());
        Log.d(TAG, "  - Token presente: " + (getToken() != null ? "Sí" : "No"));
        Log.d(TAG, "  - Timestamp: " + sharedPreferences.getLong(KEY_LOGIN_TIMESTAMP, 0));
        Log.d(TAG, "═══════════════════════════════════");
    }

    /**
     * Verifica si el token está presente
     */
    public boolean hasValidToken() {
        String token = getToken();
        return token != null && !token.isEmpty();
    }

    /**
     * Obtiene el tiempo restante de sesión en milisegundos
     */
    public long getRemainingSessionTime() {
        long loginTimestamp = sharedPreferences.getLong(KEY_LOGIN_TIMESTAMP, 0);
        if (loginTimestamp == 0) {
            return SESSION_TIMEOUT; // Sesión sin timestamp, retornar tiempo completo
        }

        long currentTime = System.currentTimeMillis();
        long elapsed = currentTime - loginTimestamp;
        long remaining = SESSION_TIMEOUT - elapsed;

        return remaining > 0 ? remaining : 0;
    }

    /**
     * Obtiene el tiempo restante de sesión en días
     */
    public int getRemainingSessionDays() {
        long remainingMs = getRemainingSessionTime();
        return (int) (remainingMs / (24 * 60 * 60 * 1000));
    }
}
