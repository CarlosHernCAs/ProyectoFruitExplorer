package com.fruitexplorer.api;

import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.FruitResponse;
import com.fruitexplorer.models.LoginRequest;
import com.fruitexplorer.models.LogQueryRequest;
import com.fruitexplorer.models.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("auth/register")
    Call<AuthResponse> registerUser(@Body RegisterRequest registerRequest);

    @POST("auth/login")
    Call<AuthResponse> loginUser(@Body LoginRequest loginRequest);

    // ▼▼▼ ¡AQUÍ ESTÁ EL CAMBIO! ▼▼▼
    @GET("fruits/slug/{slug}") // Se añade "/slug" a la ruta
    Call<FruitResponse> getFruitBySlug(@Path("slug") String fruitSlug);

    @POST("queries/log")
    Call<Void> logQuery(@Body LogQueryRequest logQueryRequest);
}

