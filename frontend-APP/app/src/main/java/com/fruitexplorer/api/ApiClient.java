package com.fruitexplorer.api;

import android.content.Context;

import com.fruitexplorer.utils.SessionManager;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {

    // Cambia esta IP por la de tu máquina si pruebas en un dispositivo físico
    private static final String BASE_URL = "http://192.168.0.106:4000/api/";
    private static Retrofit retrofit = null;
    private static ApiService apiService = null;

    // Hacemos el ApiService un singleton para reutilizar la instancia
    public static ApiService getApiService(Context context) {
        if (apiService == null) {
            retrofit = getClient(context);
            apiService = retrofit.create(ApiService.class);
        }
        return apiService;
    }

    // El método getClient ahora necesita el Context para acceder a SessionManager
    private static Retrofit getClient(Context context) {
        if (retrofit == null) {
            // Creamos un interceptor para ver los logs de las peticiones (muy útil para depurar)
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            // Creamos un interceptor para añadir el token de autenticación
            AuthInterceptor authInterceptor = new AuthInterceptor(context);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(logging) // Añadimos el interceptor de logging
                    .addInterceptor(authInterceptor) // ¡Añadimos el interceptor de autenticación!
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client) // Usamos el cliente con los interceptores
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    // Esta clase interna se encargará de añadir el token a las cabeceras
    private static class AuthInterceptor implements Interceptor {
        private SessionManager sessionManager;

        AuthInterceptor(Context context) {
            this.sessionManager = new SessionManager(context.getApplicationContext());
        }

        @Override
        public Response intercept(Chain chain) throws IOException {
            Request.Builder requestBuilder = chain.request().newBuilder();

            // Si el usuario está logueado, añadimos la cabecera "Authorization"
            if (sessionManager.isLoggedIn()) {
                String token = sessionManager.fetchAuthToken();
                if (token != null) {
                    requestBuilder.addHeader("Authorization", "Bearer " + token);
                }
            }

            return chain.proceed(requestBuilder.build());
        }
    }
}
