package com.fruitexplorer.utils;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.fruitexplorer.activities.LoginActivity;
import com.fruitexplorer.models.User;

public class SessionManager {

    private static final String PREF_NAME = "FruitExplorerSession";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";
    private static final String KEY_AUTH_TOKEN = "authToken";
    private static final String KEY_USER_ID = "userId";
    private static final String KEY_USER_EMAIL = "userEmail";
    private static final String KEY_USER_DISPLAY_NAME = "userDisplayName";
    private static final String KEY_HAS_SEEN_WELCOME = "hasSeenWelcome";

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private Context context;    

    public SessionManager(Context context) {
        this.context = context;
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
    }

    public void createLoginSession(String token, User user) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_AUTH_TOKEN, token);
        editor.putString(KEY_USER_ID, user.getId());
        editor.putString(KEY_USER_EMAIL, user.getEmail());
        editor.putString(KEY_USER_DISPLAY_NAME, user.getDisplayName());
        editor.commit();
    }

    public String getToken() {
        return sharedPreferences.getString(KEY_AUTH_TOKEN, null);
    }

    public String getUserDisplayName() {
        return sharedPreferences.getString(KEY_USER_DISPLAY_NAME, "Usuario");
    }

    public boolean isLoggedIn() {
        return sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public void logoutUser() {
        // Limpiar todos los datos de SharedPreferences
        editor.clear();
        editor.commit();

        // Redirigir al usuario a LoginActivity
        Intent i = new Intent(context, LoginActivity.class);
        // Añadir flags para limpiar el stack de actividades
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);
    }

    public void setWelcomeScreenSeen() {
        editor.putBoolean(KEY_HAS_SEEN_WELCOME, true);
        editor.commit();
    }

    public boolean hasSeenWelcomeScreen() {
        return sharedPreferences.getBoolean(KEY_HAS_SEEN_WELCOME, false);
    }
}