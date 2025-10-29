package com.fruitexplorer.api;

import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.LoginRequest;
import com.fruitexplorer.models.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {

    @POST("auth/register")
    Call<AuthResponse> registerUser(@Body RegisterRequest registerRequest);

    @POST("auth/login")
    Call<AuthResponse> loginUser(@Body LoginRequest loginRequest);
}