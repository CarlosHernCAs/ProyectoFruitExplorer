package com.fruitexplorer.api;

import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.BaseResponse;
import com.fruitexplorer.models.FruitListResponse;
import com.fruitexplorer.models.LoginRequest;
import com.fruitexplorer.models.RegionResponse;
import com.fruitexplorer.models.LogQueryRequest;
import com.fruitexplorer.models.RegisterRequest;
import com.fruitexplorer.models.RecipeListResponse;


import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Query;
import com.fruitexplorer.models.FruitResponse; // Mantener para getFruitBySlug
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
    Call<BaseResponse> logQuery(@Body LogQueryRequest logQueryRequest);

    @PUT("queries/{id}/voice")
    Call<Void> updateQueryVoiceStatus(@Path("id") long queryId);

    @GET("regions")
    Call<RegionResponse> getRegions();

    @GET("regions/{id}/fruits")
    Call<FruitListResponse> getFruitsByRegion(@Path("id") int regionId);

    // Nuevo método para listar/buscar todas las frutas
    @GET("fruits")
    Call<FruitListResponse> listFruits(@Query("q") String query);

    // Nuevo método para obtener recetas por fruta
    @GET("fruits/{id}/recipes")
    Call<RecipeListResponse> getRecipesByFruit(@Path("id") int fruitId);
}
