package com.fruitexplorer.utils;

import android.content.Context;
import android.content.Intent;
import androidx.annotation.NonNull;
import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {
    private final Context context;
    private final SessionManager sessionManager;

    public AuthInterceptor(Context context) {
        this.context = context.getApplicationContext();
        this.sessionManager = new SessionManager(context);
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        Request originalRequest = chain.request();
        Request.Builder requestBuilder = originalRequest.newBuilder();
        String path = originalRequest.url().encodedPath();
        if (sessionManager.isLoggedIn() && !path.endsWith("/register") && !path.endsWith("/login")) {
            String token = sessionManager.getToken();
            if (token != null) {
                requestBuilder.addHeader("Authorization", "Bearer " + token);
            }
        }

        Request request = requestBuilder.build();
        Response response = chain.proceed(request);

        if (response.code() == 401 || response.code() == 403) {
            sessionManager.logoutUser();
        }

        return response;
    }
}