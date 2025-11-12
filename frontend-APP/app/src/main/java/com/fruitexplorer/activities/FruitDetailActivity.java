package com.fruitexplorer.activities;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RecipeAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.LogQueryRequest;
import com.fruitexplorer.utils.SessionManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.gson.JsonObject;
import com.fruitexplorer.models.FruitResponse;
import com.fruitexplorer.models.Recipe;
import com.fruitexplorer.models.RecipeListResponse;
import com.google.android.material.appbar.CollapsingToolbarLayout;

import java.util.ArrayList;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import android.view.View;

public class FruitDetailActivity extends AppCompatActivity implements TextToSpeech.OnInitListener {

    public static final String EXTRA_FRUIT_SLUG = "extra_fruit_slug";
    public static final String EXTRA_QUERY_ID = "extra_query_id";
    private static final String TAG = "FruitDetailActivity";

    private TextToSpeech textToSpeech;
    private FloatingActionButton fabSpeak;
    private Fruit currentFruit;
    private ApiService apiService;
    private SessionManager sessionManager;
    private long queryId = -1;

    // Vistas
    private ImageView fruitImageView;
    private TextView commonNameTextView;
    private TextView scientificNameTextView;
    private TextView descriptionTextView;
    private TextView nutritionalDataTextView;
    private RecyclerView recipesRecyclerView;
    private RecipeAdapter recipeAdapter;
    private TextView recipesTitleTextView;
    private CollapsingToolbarLayout collapsingToolbar;
    private View contentLayout; // El NestedScrollView o el layout principal

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fruit_detail);

        // Configurar la Toolbar
        androidx.appcompat.widget.Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        // Inicializar vistas
        initViews();

        // Ocultar contenido hasta que los datos estén cargados
        contentLayout.setVisibility(View.INVISIBLE);

        // Obtener el slug de la fruta y el queryId del Intent
        String fruitSlug = getIntent().getStringExtra(EXTRA_FRUIT_SLUG);
        queryId = getIntent().getLongExtra(EXTRA_QUERY_ID, -1);

        // Inicializar servicios
        textToSpeech = new TextToSpeech(this, this);
        apiService = ApiClient.getApiService(this);
        sessionManager = new SessionManager(this);

        if (fruitSlug != null && !fruitSlug.isEmpty()) {
            fetchFruitDetails(fruitSlug);
        } else {
            Toast.makeText(this, "No se pudo cargar la fruta.", Toast.LENGTH_SHORT).show();
            finish();
        }

        fabSpeak.setOnClickListener(v -> speakDescription());
    }

    private void initViews() {
        fruitImageView = findViewById(R.id.fruitImageView);
        commonNameTextView = findViewById(R.id.commonNameTextView);
        scientificNameTextView = findViewById(R.id.scientificNameTextView);
        descriptionTextView = findViewById(R.id.descriptionTextView);
        nutritionalDataTextView = findViewById(R.id.nutritionalDataTextView);
        recipesRecyclerView = findViewById(R.id.recipesRecyclerView);
        recipesTitleTextView = findViewById(R.id.recipesTitleTextView);
        fabSpeak = findViewById(R.id.fabSpeak);
        collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        contentLayout = findViewById(R.id.nested_scroll_view); // Asegúrate de que tu NestedScrollView tenga este ID
    }

    private void fetchFruitDetails(String slug) {
        // Aquí podrías mostrar un ProgressBar
        apiService.getFruitBySlug(slug).enqueue(new Callback<FruitResponse>() {
            @Override
            public void onResponse(Call<FruitResponse> call, Response<FruitResponse> response) {
                // Ocultar ProgressBar
                if (response.isSuccessful() && response.body() != null && response.body().getFruit() != null) {
                    currentFruit = response.body().getFruit();
                    populateUi();
                    contentLayout.setVisibility(View.VISIBLE); // Mostrar contenido
                } else {
                    Log.e(TAG, "Error al obtener detalles de la fruta. Código: " + response.code());
                    Toast.makeText(FruitDetailActivity.this, "Error al cargar la fruta.", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }

            @Override
            public void onFailure(Call<FruitResponse> call, Throwable t) {
                // Ocultar ProgressBar
                Log.e(TAG, "Fallo de red al obtener detalles de la fruta.", t);
                Toast.makeText(FruitDetailActivity.this, "Error de conexión.", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }

    private void populateUi() {
        if (currentFruit == null) return;

        // Poblar las vistas con los datos de la fruta
        collapsingToolbar.setTitle(currentFruit.getCommonName());
        commonNameTextView.setText(currentFruit.getCommonName());
        scientificNameTextView.setText(currentFruit.getScientificName());
        descriptionTextView.setText(currentFruit.getDescription());

        // Cargar la imagen desde la URL usando Glide
        Glide.with(this)
                .load(currentFruit.getImageUrl())
                .placeholder(R.drawable.ic_launcher_background)
                .error(R.drawable.ic_launcher_background)
                .into(fruitImageView);

        // Formatear y mostrar los datos nutricionales
        nutritionalDataTextView.setText(formatNutritionalData(currentFruit.getNutritionalData()));

        // Configurar RecyclerView para recetas
        setupRecyclerView();

        // Cargar recetas para la fruta actual
        fetchRecipesForFruit(currentFruit.getId());
    }

    private void setupRecyclerView() {
        recipesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        recipeAdapter = new RecipeAdapter(this, new ArrayList<Recipe>(), recipe -> {
            // Aquí puedes manejar el clic en una receta, por ejemplo, abrir otra actividad con los detalles de la receta.
            Toast.makeText(this, "Receta seleccionada: " + recipe.getTitle(), Toast.LENGTH_SHORT).show();
        });
        recipesRecyclerView.setAdapter(recipeAdapter);
    }

    private void fetchRecipesForFruit(int fruitId) {
        apiService.getRecipesByFruit(fruitId).enqueue(new Callback<RecipeListResponse>() {
            @Override
            public void onResponse(Call<RecipeListResponse> call, Response<RecipeListResponse> response) {
                if (response.isSuccessful() && response.body() != null && !response.body().getRecipes().isEmpty()) {
                    recipesTitleTextView.setVisibility(TextView.VISIBLE);
                    recipesRecyclerView.setVisibility(RecyclerView.VISIBLE);
                    // Usar un ícono existente para el título de recetas
                    recipesTitleTextView.setCompoundDrawablesWithIntrinsicBounds(android.R.drawable.ic_menu_slideshow, 0, 0, 0); // Este ícono puede no ser el mejor, pero es para el ejemplo
                    recipeAdapter.updateRecipes(response.body().getRecipes());
                } else {
                    recipesTitleTextView.setVisibility(TextView.GONE);
                    recipesRecyclerView.setVisibility(RecyclerView.GONE);
                }
            }

            @Override
            public void onFailure(Call<RecipeListResponse> call, Throwable t) {
                Log.e(TAG, "Error al obtener las recetas para la fruta.", t);
            }
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
                // Usar un ícono existente para el botón de hablar
                fabSpeak.setImageResource(android.R.drawable.ic_btn_speak_now);
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