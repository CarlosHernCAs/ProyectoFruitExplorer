package com.fruitexplorer.api;

import android.content.Context;
import android.util.Log;

import com.fruitexplorer.utils.AuthInterceptor;
import com.fruitexplorer.utils.Constants;

import org.osmdroid.library.BuildConfig;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static final String BASE_URL = Constants.API_BASE_URL;
    private static ApiService apiService;

    public static ApiService getApiService(Context context) {
        if (apiService == null) {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(BuildConfig.DEBUG ? HttpLoggingInterceptor.Level.BODY : HttpLoggingInterceptor.Level.NONE);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(new AuthInterceptor(context)) // Asegúrate de que el interceptor recibe el contexto
                    .addInterceptor(loggingInterceptor)
                    .build();

            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build();
            apiService = retrofit.create(ApiService.class);
        }
        return apiService;
    }
}