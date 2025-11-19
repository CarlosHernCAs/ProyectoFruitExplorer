package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;

import com.fruitexplorer.R;
import com.fruitexplorer.utils.SessionManager;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DELAY = 2000; 

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            SessionManager sessionManager = new SessionManager(getApplicationContext());

            Intent intent;
            if (sessionManager.isLoggedIn()) {
                intent = sessionManager.hasSeenWelcomeScreen()
                        ? new Intent(SplashActivity.this, ExploreActivity.class)
                        : new Intent(SplashActivity.this, WelcomeActivity.class);
            } else {
                intent = new Intent(SplashActivity.this, LoginActivity.class);
            }

            startActivity(intent);
            finish(); 
        }, SPLASH_DELAY);
    }
}