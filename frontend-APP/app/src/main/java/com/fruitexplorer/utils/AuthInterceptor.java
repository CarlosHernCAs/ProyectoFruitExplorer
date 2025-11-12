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
        Request originalRequest = chain.request();
        Request.Builder requestBuilder = originalRequest.newBuilder();
        String path = originalRequest.url().encodedPath();

        // CORRECCIÓN: Solo añadimos el token si el usuario está logueado
        // Y si la ruta NO es de registro o login.
        if (sessionManager.isLoggedIn() && !path.endsWith("/register") && !path.endsWith("/login")) {
            String token = sessionManager.getToken();
            if (token != null) {
                requestBuilder.addHeader("Authorization", "Bearer " + token);
            }
        }

        // Continuamos con la petición, ya sea la original o la modificada con el token.
        return chain.proceed(requestBuilder.build());
    }
}