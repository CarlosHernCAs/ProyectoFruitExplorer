package com.fruitexplorer.api;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import com.fruitexplorer.utils.AuthInterceptor;
import com.fruitexplorer.utils.Constants;
import com.fruitexplorer.BuildConfig;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Cliente API mejorado con:
 * - Detección automática de emulador/dispositivo físico
 * - Configuración de timeouts personalizables
 * - Logging condicional según modo debug/release
 * - Verificación de conectividad
 * - Patrón Singleton para Retrofit
 */
public class ApiClient {
    private static final String TAG = "ApiClient";
    private static Retrofit retrofit = null;
    private static OkHttpClient okHttpClient = null;

    /**
     * Obtiene una instancia del servicio API
     * Implementa patrón Singleton para reutilizar la conexión
     */
    public static ApiService getApiService(Context context) {
        if (retrofit == null) {
            synchronized (ApiClient.class) {
                if (retrofit == null) {
                    retrofit = createRetrofit(context);
                }
            }
        }
        return retrofit.create(ApiService.class);
    }

    /**
     * Crea una instancia de Retrofit con configuración optimizada
     */
    private static Retrofit createRetrofit(Context context) {
        String baseUrl = Constants.API_BASE_URL;
        Log.d(TAG, "Inicializando API Client con URL: " + baseUrl);
        Log.d(TAG, "Modo: " + (BuildConfig.DEBUG ? "DEBUG" : "RELEASE"));
        Log.d(TAG, "Emulador detectado: " + isRunningOnEmulator());

        return new Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(getOkHttpClient(context))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    /**
     * Crea y configura el cliente OkHttp con interceptores
     */
    private static OkHttpClient getOkHttpClient(Context context) {
        if (okHttpClient == null) {
            OkHttpClient.Builder builder = new OkHttpClient.Builder();

            // Configurar timeouts
            builder.connectTimeout(Constants.CONNECT_TIMEOUT, TimeUnit.SECONDS)
                   .readTimeout(Constants.READ_TIMEOUT, TimeUnit.SECONDS)
                   .writeTimeout(Constants.WRITE_TIMEOUT, TimeUnit.SECONDS);

            // Agregar interceptor de autenticación
            builder.addInterceptor(new AuthInterceptor(context));

            // Agregar logging solo en modo debug
            if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
                loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
                builder.addInterceptor(loggingInterceptor);
                Log.d(TAG, "HTTP Logging habilitado (modo DEBUG)");
            }

            // Agregar interceptor de conectividad
            builder.addInterceptor(chain -> {
                if (!isNetworkAvailable(context)) {
                    Log.w(TAG, "Sin conexión a internet");
                }
                return chain.proceed(chain.request());
            });

            okHttpClient = builder.build();
        }
        return okHttpClient;
    }

    /**
     * Verifica si hay conexión a internet
     */
    public static boolean isNetworkAvailable(Context context) {
        if (context == null) return false;

        ConnectivityManager connectivityManager =
                (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (connectivityManager != null) {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }
        return false;
    }

    /**
     * Detecta si está corriendo en un emulador
     * (Duplicado de Constants para logging)
     */
    private static boolean isRunningOnEmulator() {
        return android.os.Build.FINGERPRINT.startsWith("generic")
                || android.os.Build.FINGERPRINT.startsWith("unknown")
                || android.os.Build.MODEL.contains("google_sdk")
                || android.os.Build.MODEL.contains("Emulator")
                || android.os.Build.MODEL.contains("Android SDK built for x86")
                || android.os.Build.MANUFACTURER.contains("Genymotion")
                || (android.os.Build.BRAND.startsWith("generic") && android.os.Build.DEVICE.startsWith("generic"))
                || "google_sdk".equals(android.os.Build.PRODUCT);
    }

    /**
     * Resetea la instancia de Retrofit (útil para testing o cambiar configuración)
     */
    public static void resetInstance() {
        retrofit = null;
        okHttpClient = null;
        Log.d(TAG, "ApiClient reiniciado");
    }

    /**
     * Obtiene la URL base actual
     */
    public static String getBaseUrl() {
        return Constants.API_BASE_URL;
    }

    /**
     * Verifica la salud del servidor (health check)
     */
    public static void checkServerHealth(Context context, HealthCheckCallback callback) {
        new Thread(() -> {
            try {
                ApiService service = getApiService(context);
                retrofit2.Response<Void> response = service.healthCheck().execute();

                if (response.isSuccessful()) {
                    Log.i(TAG, "✅ Servidor respondiendo correctamente");
                    callback.onSuccess();
                } else {
                    Log.w(TAG, "⚠️ Servidor respondió con código: " + response.code());
                    callback.onError("Servidor no disponible (código: " + response.code() + ")");
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Error al conectar con servidor: " + e.getMessage());
                callback.onError("Error de conexión: " + e.getMessage());
            }
        }).start();
    }

    /**
     * Interfaz para callback de health check
     */
    public interface HealthCheckCallback {
        void onSuccess();
        void onError(String message);
    }
}
