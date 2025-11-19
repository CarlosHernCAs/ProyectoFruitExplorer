package com.fruitexplorer.activities;

import android.os.Bundle;
import android.view.View;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RecipeStepAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Recipe;
import com.fruitexplorer.models.RecipeStep;
import com.fruitexplorer.models.RecipeDetailResponse;
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.card.MaterialCardView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RecipeDetailActivity extends AppCompatActivity {

    public static final String EXTRA_RECIPE = "extra_recipe";
    private static final String TAG = "RecipeDetailActivity";

    private Recipe recipe;
    private ApiService apiService;

    private MaterialCardView sourceCard;
    private MaterialCardView stepsCard;
    private TextView recipeSourceTextView;
    private RecyclerView stepsRecyclerView;
    private RecipeStepAdapter stepsAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recipe_detail);

        recipe = getIntent().getParcelableExtra(EXTRA_RECIPE);

        if (recipe == null) {
            Toast.makeText(this, "No se pudo cargar la receta.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        apiService = ApiClient.getApiService(this);

        setupToolbar();
        initViews();
        fetchRecipeDetails();
    }

    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        CollapsingToolbarLayout collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        collapsingToolbar.setTitle(recipe.getTitle());
    }

    private void initViews() {
        ImageView recipeImageView = findViewById(R.id.recipeImageView);
        TextView recipeDescriptionTextView = findViewById(R.id.recipeDescriptionTextView);        
        sourceCard = findViewById(R.id.sourceCard);
        stepsCard = findViewById(R.id.stepsCard);
        stepsRecyclerView = findViewById(R.id.stepsRecyclerView);
        recipeSourceTextView = findViewById(R.id.recipeSourceTextView);

        sourceCard.setVisibility(View.GONE);
        stepsCard.setVisibility(View.GONE);

        stepsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        stepsAdapter = new RecipeStepAdapter();
        stepsRecyclerView.setAdapter(stepsAdapter);

        recipeDescriptionTextView.setText(recipe.getDescription());
        Glide.with(this).load(recipe.getImageUrl()).into(recipeImageView);
    }

    private void fetchRecipeDetails() {
        apiService.getRecipeById(recipe.getId()).enqueue(new Callback<RecipeDetailResponse>() {
            @Override
            public void onResponse(Call<RecipeDetailResponse> call, Response<RecipeDetailResponse> response) {
                if (response.isSuccessful()) {
                    RecipeDetailResponse detailResponse = response.body();
                    if (detailResponse == null || detailResponse.getRecipe() == null) {
                        Toast.makeText(RecipeDetailActivity.this, "Detalles de la receta no encontrados.", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    Recipe detailedRecipe = detailResponse.getRecipe();
                    if (detailedRecipe.getSource() != null && !detailedRecipe.getSource().isEmpty()) {
                        sourceCard.setVisibility(View.VISIBLE);
                        recipeSourceTextView.setText("Fuente: " + detailedRecipe.getSource());
                    }

                    if (detailResponse.getSteps() != null && !detailResponse.getSteps().isEmpty()) {
                        stepsCard.setVisibility(View.VISIBLE);
                        stepsAdapter.setSteps(detailResponse.getSteps());
                    }
                }
            }

            @Override
            public void onFailure(Call<RecipeDetailResponse> call, Throwable t) {
                Toast.makeText(RecipeDetailActivity.this, "Error al cargar los detalles de la receta", Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Error de red al cargar detalles de la receta", t);
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}