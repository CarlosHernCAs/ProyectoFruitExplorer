package com.fruitexplorer.utils;

import android.content.Context;
import androidx.annotation.NonNull;
import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final SessionManager sessionManager;

    public AuthInterceptor(Context context) {
        this.sessionManager = new SessionManager(context);
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        Request.Builder requestBuilder = chain.request().newBuilder();

        // Si el usuario está logueado, añadimos el token a la cabecera
        if (sessionManager.isLoggedIn()) {
            String token = sessionManager.getToken();
            if (token != null) {
                requestBuilder.addHeader("Authorization", "Bearer " + token);
            }
        }

        return chain.proceed(requestBuilder.build());
    }
}