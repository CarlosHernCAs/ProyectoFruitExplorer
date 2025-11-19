package com.fruitexplorer.api;

import android.content.Context;
import android.util.Log;

import com.fruitexplorer.utils.AuthInterceptor;
import com.fruitexplorer.utils.Constants;
import com.fruitexplorer.BuildConfig; // <<< CORRECCIÓN: Usar el BuildConfig de tu app
 
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static final String BASE_URL = Constants.API_BASE_URL;
    private static Retrofit retrofit = null; // <<< MEJORA: Usar una instancia de Retrofit

    public static ApiService getApiService(Context context) {
        // MEJORA: Usar un singleton para Retrofit en lugar de para ApiService
        if (retrofit == null) {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            // CORRECCIÓN: Usar el BuildConfig de tu propia aplicación, no el de una librería externa.
            loggingInterceptor.setLevel(BuildConfig.DEBUG ? HttpLoggingInterceptor.Level.BODY : HttpLoggingInterceptor.Level.NONE);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(new AuthInterceptor(context)) // Asegúrate de que el interceptor recibe el contexto
                    .addInterceptor(loggingInterceptor)
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build();
        }
        // Siempre creamos una nueva instancia del servicio desde Retrofit.
        // Retrofit se encarga de que esto sea eficiente.
        return retrofit.create(ApiService.class);
    }
}