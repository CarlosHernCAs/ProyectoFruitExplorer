package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.FruitAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit; // Ya estaba importado
import com.fruitexplorer.models.FruitListResponse; // Importar el nuevo modelo

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegionFruitsActivity extends AppCompatActivity implements FruitAdapter.OnFruitClickListener {
    private static final String TAG = "RegionFruitsActivity";
    private RecyclerView fruitsRecyclerView;
    private FruitAdapter fruitAdapter;
    private List<Fruit> fruitList = new ArrayList<>();
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Asumimos que crearás un layout activity_region_fruits.xml
        setContentView(R.layout.activity_region_fruits);

        int regionId = getIntent().getIntExtra("REGION_ID", -1);
        String regionName = getIntent().getStringExtra("REGION_NAME");

        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Frutas de " + regionName);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        apiService = ApiClient.getApiService(this);
        fruitsRecyclerView = findViewById(R.id.fruitsRecyclerView);
        setupRecyclerView();

        if (regionId != -1) {
            fetchFruits(regionId);
        }
    }

    private void setupRecyclerView() {
        fruitsRecyclerView.setLayoutManager(new GridLayoutManager(this, 2)); // 2 columnas
        fruitAdapter = new FruitAdapter(this, fruitList, this);
        fruitsRecyclerView.setAdapter(fruitAdapter);
    }

    private void fetchFruits(int regionId) {
        apiService.getFruitsByRegion(regionId).enqueue(new Callback<FruitListResponse>() { // Usar FruitListResponse
            @Override
            public void onResponse(Call<FruitListResponse> call, Response<FruitListResponse> response) { // Usar FruitListResponse
                if (response.isSuccessful() && response.body() != null && response.body().getFruits() != null) {
                    fruitAdapter.updateFruits(response.body().getFruits());
                } else {
                    // Si la respuesta no es exitosa (ej. 404) o no hay frutas, mostramos un mensaje.
                    Toast.makeText(RegionFruitsActivity.this, "No se encontraron frutas para esta región.", Toast.LENGTH_LONG).show();
                }
            }
            @Override
            public void onFailure(Call<FruitListResponse> call, Throwable t) { // Usar FruitListResponse
                Log.e(TAG, "Error de red al cargar frutas: ", t);
            }
        });
    }

    @Override
    public void onFruitClick(Fruit fruit) {
        Intent intent = new Intent(this, FruitDetailActivity.class);
        intent.putExtra(FruitDetailActivity.EXTRA_FRUIT_SLUG, fruit.getSlug());
        startActivity(intent);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}