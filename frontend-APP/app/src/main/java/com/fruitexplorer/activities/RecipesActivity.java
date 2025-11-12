package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RecipeAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Recipe;
import com.fruitexplorer.models.RecipeListResponse;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RecipesActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private RecipeAdapter recipeAdapter;
    private ApiService apiService;
    private ProgressBar progressBar;
    // Handler para el retraso en la búsqueda (debounce)
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recipes);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Recetas de Frutas");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        recyclerView = findViewById(R.id.recipesRecyclerView);
        progressBar = findViewById(R.id.progressBar);
        apiService = ApiClient.getApiService(this);

        setupRecyclerView();
        fetchRecipes(null); // Cargar todas las recetas al inicio
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.search_menu, menu); // Reutilizamos un menú de búsqueda genérico

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                handler.removeCallbacksAndMessages(null);
                fetchRecipes(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                handler.removeCallbacksAndMessages(null);
                handler.postDelayed(() -> fetchRecipes(newText), 300); // 300ms de retraso
                return true;
            }
        });

        return true;
    }

    private void setupRecyclerView() {
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recipeAdapter = new RecipeAdapter(this, new ArrayList<>(), recipe -> {
            Intent intent = new Intent(this, RecipeDetailActivity.class);
            intent.putExtra(RecipeDetailActivity.EXTRA_RECIPE, recipe);
            startActivity(intent);
        });
        recyclerView.setAdapter(recipeAdapter);
    }

    private void fetchRecipes(String query) {
        progressBar.setVisibility(View.VISIBLE);
        String actualQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        apiService.getRecipes(actualQuery).enqueue(new Callback<RecipeListResponse>() {
            @Override
            public void onResponse(Call<RecipeListResponse> call, Response<RecipeListResponse> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().getRecipes() != null) {
                    recipeAdapter.updateRecipes(response.body().getRecipes());
                } else {
                    Toast.makeText(RecipesActivity.this, "Error al cargar las recetas.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<RecipeListResponse> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(RecipesActivity.this, "Fallo de conexión.", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}