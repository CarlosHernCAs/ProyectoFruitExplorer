package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.ViewCompat;
import androidx.core.widget.TextViewCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RecipeAdapter;
import com.fruitexplorer.api.ApiClient;
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
    private com.fruitexplorer.api.ApiService apiService;
    private SessionManager sessionManager;
    private long queryId = -1;

    private ImageView fruitImageView;
    private TextView commonNameTextView;
    private TextView scientificNameTextView;
    private TextView descriptionTextView;
    private RecyclerView recipesRecyclerView;
    private RecipeAdapter recipeAdapter;
    private TextView recipesTitleTextView;
    private CollapsingToolbarLayout collapsingToolbar;
    private View contentLayout;
    private GridLayout nutritionalGridLayout;
    private View nutritionalCard;
    private View recipesCard;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fruit_detail);

        androidx.appcompat.widget.Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        initViews();
        setupSharedElementTransition();

        contentLayout.setVisibility(View.INVISIBLE);

        String fruitSlug = getIntent().getStringExtra(EXTRA_FRUIT_SLUG);
        queryId = getIntent().getLongExtra(EXTRA_QUERY_ID, -1);

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
        recipesRecyclerView = findViewById(R.id.recipesRecyclerView);
        recipesTitleTextView = findViewById(R.id.recipesTitleTextView);
        fabSpeak = findViewById(R.id.fabSpeak);
        collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        contentLayout = findViewById(R.id.nested_scroll_view);
        nutritionalGridLayout = findViewById(R.id.nutritionalGridLayout);
        nutritionalCard = findViewById(R.id.nutritionalCard);
        recipesCard = findViewById(R.id.recipesCard);
    }
    private void setupSharedElementTransition() {
        ViewCompat.setTransitionName(fruitImageView, "fruit_image");
    }

    private void fetchFruitDetails(String slug) {
        apiService.getFruitBySlug(slug).enqueue(new Callback<FruitResponse>() {
            @Override
            public void onResponse(Call<FruitResponse> call, Response<FruitResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getFruit() != null) {
                    currentFruit = response.body().getFruit();
                    populateUi();
                    contentLayout.setVisibility(View.VISIBLE);
                } else {
                    Log.e(TAG, "Error al obtener detalles de la fruta. Código: " + response.code());
                    Toast.makeText(FruitDetailActivity.this, "Error al cargar la fruta.", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }

            @Override
            public void onFailure(Call<FruitResponse> call, Throwable t) {
                Log.e(TAG, "Fallo de red al obtener detalles de la fruta.", t);
                Toast.makeText(FruitDetailActivity.this, "Error de conexión.", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }

    private void populateUi() {
        if (currentFruit == null) return;

        collapsingToolbar.setTitle(" ");

        commonNameTextView.setText(currentFruit.getCommonName());
        scientificNameTextView.setText(currentFruit.getScientificName());
        Glide.with(this)
                .load(currentFruit.getImageUrl())
                .placeholder(R.drawable.ic_launcher_background)
                .error(R.drawable.ic_launcher_background)
                .into(fruitImageView);

        descriptionTextView.setText(currentFruit.getDescription());
        populateNutritionalData(currentFruit.getNutritionalData());


        fabSpeak.setVisibility(View.VISIBLE);

        setupRecyclerView();

        fetchRecipesForFruit(currentFruit.getId());
    }

    private void setupRecyclerView() {
        recipesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        recipeAdapter = new RecipeAdapter(this, new ArrayList<Recipe>(), recipe -> {
            Intent intent = new Intent(this, RecipeDetailActivity.class);
            intent.putExtra(RecipeDetailActivity.EXTRA_RECIPE, recipe);
            startActivity(intent);
        });
        recipesRecyclerView.setAdapter(recipeAdapter);
    }

    private void fetchRecipesForFruit(int fruitId) {
        apiService.getRecipesByFruit(fruitId).enqueue(new Callback<RecipeListResponse>() {
            @Override
            public void onResponse(Call<RecipeListResponse> call, Response<RecipeListResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getRecipes() != null && !response.body().getRecipes().isEmpty()) {
                    recipesCard.setVisibility(View.VISIBLE);
                    recipeAdapter.updateRecipes(response.body().getRecipes());
                } else {
                    recipesCard.setVisibility(View.GONE);
                }
            }

            @Override
            public void onFailure(Call<RecipeListResponse> call, Throwable t) {
                Log.e(TAG, "Error al obtener las recetas para la fruta.", t);
            }
        });
    }

    private void populateNutritionalData(JsonObject nutritionalData) {
        if (nutritionalData == null || nutritionalData.size() == 0) {
            nutritionalCard.setVisibility(View.GONE);
            return;
        }

        nutritionalCard.setVisibility(View.VISIBLE);
        nutritionalGridLayout.removeAllViews();

        TextView nutritionalTextView = new TextView(this);
        TextViewCompat.setTextAppearance(nutritionalTextView, android.R.style.TextAppearance_DeviceDefault_Medium);
        nutritionalTextView.setLineSpacing(8f, 1f);

        StringBuilder builder = new StringBuilder();
        for (Map.Entry<String, com.google.gson.JsonElement> entry : nutritionalData.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().getAsString();
            String formattedKey = key.substring(0, 1).toUpperCase() + key.substring(1);

            builder.append("• ").append(formattedKey).append(": ").append(value).append("\n");
        }

        nutritionalTextView.setText(builder.toString().trim());
        nutritionalGridLayout.addView(nutritionalTextView);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            int result = textToSpeech.setLanguage(new Locale("es", "ES"));
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e(TAG, "El idioma español no está soportado en este dispositivo.");
            } else {
                fabSpeak.setImageResource(android.R.drawable.ic_btn_speak_now);
                fabSpeak.setEnabled(true);
            }
        } else {
            Log.e(TAG, "Falló la inicialización de TextToSpeech.");
        }
    }

    private void speakDescription() {
        if (currentFruit == null) {
            return;
        }

        StringBuilder textToSpeak = new StringBuilder();

        textToSpeak.append(currentFruit.getCommonName()).append(". ");
        textToSpeak.append("\n\n");

        textToSpeak.append("Descripción. ").append(currentFruit.getDescription()).append(". ");
        textToSpeak.append("\n\n");

        JsonObject nutritionalData = currentFruit.getNutritionalData();
        if (nutritionalData != null && nutritionalData.size() > 0) {
            textToSpeak.append("Datos nutricionales. ");
            for (Map.Entry<String, com.google.gson.JsonElement> entry : nutritionalData.entrySet()) {
                String formattedKey = entry.getKey().substring(0, 1).toUpperCase() + entry.getKey().substring(1);
                textToSpeak.append(formattedKey).append(": ").append(entry.getValue().getAsString()).append(". ");
            }
        }

        if (textToSpeak.length() > 0) {
            logVoiceUsage();
            textToSpeech.speak(textToSpeak.toString(), TextToSpeech.QUEUE_FLUSH, null, null);
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
            public void onFailure(Call<Void> call, Throwable t) { }
        });
    }

    @Override
    protected void onDestroy() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        super.onDestroy();
    }
}