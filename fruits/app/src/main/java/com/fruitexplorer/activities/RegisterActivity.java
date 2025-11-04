package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.AuthResponse;
import com.fruitexplorer.models.RegisterRequest;
import com.fruitexplorer.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private EditText editTextDisplayName, editTextEmail, editTextPassword;
    private Button buttonRegister;
    private ApiService apiService;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        editTextDisplayName = findViewById(R.id.editTextDisplayName);
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        buttonRegister = findViewById(R.id.buttonRegister);

        apiService = ApiClient.getApiService(this);
        sessionManager = new SessionManager(getApplicationContext());

        buttonRegister.setOnClickListener(v -> registerUser());
    }

    private void registerUser() {
        String displayName = editTextDisplayName.getText().toString().trim();
        String email = editTextEmail.getText().toString().trim();
        String password = editTextPassword.getText().toString().trim();

        if (displayName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        RegisterRequest registerRequest = new RegisterRequest(email, password, displayName);
        Call<AuthResponse> call = apiService.registerUser(registerRequest);

        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Guardar la sesión del nuevo usuario
                    sessionManager.createLoginSession(response.body().getToken(), response.body().getUsuario());

                    // Como es un nuevo registro, siempre vamos a la pantalla de bienvenida
                    Intent intent = new Intent(RegisterActivity.this, WelcomeActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    // Manejar error de la API (ej. usuario ya existe)
                    Toast.makeText(RegisterActivity.this, "Error en el registro. Código: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                // Manejar error de red
                Log.e("RegisterActivity", "Error de red: ", t);
                Toast.makeText(RegisterActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}