package com.fruitexplorer.activities;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.LogQueryRequest;
import com.fruitexplorer.utils.SessionManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.gson.JsonObject;

import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FruitDetailActivity extends AppCompatActivity implements TextToSpeech.OnInitListener {

    public static final String EXTRA_FRUIT = "extra_fruit";
    public static final String EXTRA_QUERY_ID = "extra_query_id";
    private static final String TAG = "FruitDetailActivity";

    private TextToSpeech textToSpeech;
    private FloatingActionButton fabSpeak;
    private TextView descriptionTextView;
    private Fruit currentFruit;
    private ApiService apiService;
    private SessionManager sessionManager;
    private long queryId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fruit_detail);

        // Obtener las vistas
        ImageView fruitImageView = findViewById(R.id.fruitImageView);
        TextView commonNameTextView = findViewById(R.id.commonNameTextView);
        TextView scientificNameTextView = findViewById(R.id.scientificNameTextView);
        descriptionTextView = findViewById(R.id.descriptionTextView);
        TextView nutritionalDataTextView = findViewById(R.id.nutritionalDataTextView);
        fabSpeak = findViewById(R.id.fabSpeak);

        // Recibir el objeto Fruit del Intent
        currentFruit = getIntent().getParcelableExtra(EXTRA_FRUIT);
        queryId = getIntent().getLongExtra(EXTRA_QUERY_ID, -1);

        // Inicializar TextToSpeech
        textToSpeech = new TextToSpeech(this, this);
        apiService = ApiClient.getApiService(this);
        sessionManager = new SessionManager(this);

        if (currentFruit != null) {
            // Poblar las vistas con los datos de la fruta
            if (getSupportActionBar() != null) {
                getSupportActionBar().setTitle(currentFruit.getCommonName());
                getSupportActionBar().setDisplayHomeAsUpEnabled(true); // Muestra el botón de atrás
            }

            commonNameTextView.setText(currentFruit.getCommonName());
            scientificNameTextView.setText(currentFruit.getScientificName());
            descriptionTextView.setText(currentFruit.getDescription());

            // Cargar la imagen desde la URL usando Glide
            Glide.with(this)
                    .load(currentFruit.getImageUrl())
                    .placeholder(R.drawable.ic_launcher_background) // Imagen mientras carga
                    .error(R.drawable.ic_launcher_background)       // Imagen si hay error
                    .into(fruitImageView);

            // Formatear y mostrar los datos nutricionales
            nutritionalDataTextView.setText(formatNutritionalData(currentFruit.getNutritionalData()));
        }

        fabSpeak.setOnClickListener(v -> {
            speakDescription();
        });
    }

    private String formatNutritionalData(JsonObject nutritionalData) {
        if (nutritionalData == null || nutritionalData.size() == 0) {
            return "No disponible.";
        }
        StringBuilder builder = new StringBuilder();
        for (Map.Entry<String, com.google.gson.JsonElement> entry : nutritionalData.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().getAsString();
            // Capitalizar la primera letra de la clave
            String formattedKey = key.substring(0, 1).toUpperCase() + key.substring(1);
            builder.append(formattedKey).append(": ").append(value).append("\n");
        }
        return builder.toString().trim();
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed(); // Acción para el botón de atrás en la barra de título
        return true;
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            // Configurar el idioma a español
            int result = textToSpeech.setLanguage(new Locale("es", "ES"));
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e(TAG, "El idioma español no está soportado en este dispositivo.");
            } else {
                fabSpeak.setEnabled(true); // Habilitar el botón una vez que TTS esté listo
            }
        } else {
            Log.e(TAG, "Falló la inicialización de TextToSpeech.");
        }
    }

    private void speakDescription() {
        String description = descriptionTextView.getText().toString();
        if (!description.isEmpty()) {
            // Registramos que se usó la voz
            logVoiceUsage();
            textToSpeech.speak(description, TextToSpeech.QUEUE_FLUSH, null, null);
        }
    }

    private void logVoiceUsage() {
        if (queryId == -1 || !sessionManager.isLoggedIn()) {
            Log.w(TAG, "No hay ID de consulta válido para actualizar.");
            return;
        }

        apiService.updateQueryVoiceStatus(queryId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.i(TAG, "Uso de voz registrado para: " + currentFruit.getCommonName());
                } else {
                    Log.e(TAG, "Error al actualizar el uso de voz. Código: " + response.code());
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) { /* No hacemos nada si falla */ }
        });
    }

    @Override
    protected void onDestroy() {
        // Liberar los recursos de TextToSpeech para evitar fugas de memoria
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        super.onDestroy();
    }
}