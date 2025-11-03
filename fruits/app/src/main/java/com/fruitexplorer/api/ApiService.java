package com.fruitexplorer.api;

import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.LoginRequest;
import com.fruitexplorer.models.FruitResponse;
import com.fruitexplorer.models.RegisterRequest;
import com.fruitexplorer.models.Fruit;

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

        // Nuevo endpoint para obtener detalles de una fruta por su nombre
    @GET("fruits/slug/{fruitSlug}")
    Call<FruitResponse> getFruitBySlug(@Path("fruitSlug") String fruitSlug);
}
