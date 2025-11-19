package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.EditText;
import android.widget.Toast;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import androidx.appcompat.app.AppCompatActivity;

import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.LoginRequest;
import com.fruitexplorer.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText editTextEmail, editTextPassword;
    private Button buttonLogin, buttonGoToRegister;
    private ApiService apiService;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        apiService = ApiClient.getApiService(this);
        sessionManager = new SessionManager(this);

        editTextEmail = findViewById(R.id.emailInput);
        editTextPassword = findViewById(R.id.passwordInput);
        buttonLogin = findViewById(R.id.btnLogin);
        buttonGoToRegister = findViewById(R.id.btnGoToRegister);

        ImageView logo = findViewById(R.id.logoImageView);
        Animation logoAnimation = AnimationUtils.loadAnimation(this, R.anim.logo_animation);
        logo.startAnimation(logoAnimation);

        buttonLogin.setOnClickListener(v -> loginUser());
        buttonGoToRegister.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
            startActivity(intent);
        });
    }

    private void loginUser() {
        String email = editTextEmail.getText().toString().trim();
        String password = editTextPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        LoginRequest loginRequest = new LoginRequest(email, password);
        Call<AuthResponse> call = apiService.loginUser(loginRequest);

        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    sessionManager.createLoginSession(response.body().getToken(), response.body().getUsuario());

                    goToNextActivity();
                } else {
                    Toast.makeText(LoginActivity.this, "Error en el login. Código: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                Log.e("LoginActivity", "Error de red: ", t);
                Toast.makeText(LoginActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void goToNextActivity() {
        Intent intent;
        if (sessionManager.hasSeenWelcomeScreen()) {
            intent = new Intent(LoginActivity.this, ExploreActivity.class);
        } else {
            intent = new Intent(LoginActivity.this, WelcomeActivity.class);
        }
        startActivity(intent);
        finish();
    }
}