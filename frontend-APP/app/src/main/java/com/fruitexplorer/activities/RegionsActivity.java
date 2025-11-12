package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RegionAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Region;
import com.fruitexplorer.models.RegionResponse;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegionsActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private RegionAdapter regionAdapter;
    private ApiService apiService;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_regions);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Regiones del Perú");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        recyclerView = findViewById(R.id.regionsRecyclerView);
        progressBar = findViewById(R.id.progressBar);

        apiService = ApiClient.getApiService(this);

        setupRecyclerView();
        fetchRegions();
    }

    private void setupRecyclerView() {
        recyclerView.setLayoutManager(new GridLayoutManager(this, 2)); // 2 columnas
        regionAdapter = new RegionAdapter(this, new ArrayList<>(), region -> {
            // Acción al hacer clic en una región:
            // Iniciar RegionDetailActivity y pasar el objeto Region completo.
            Intent intent = new Intent(this, RegionDetailActivity.class);
            intent.putExtra(RegionDetailActivity.EXTRA_REGION, region); // EXTRA_REGION es la clave que espera RegionDetailActivity
            startActivity(intent);
        });
        recyclerView.setAdapter(regionAdapter);
    }

    private void fetchRegions() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getRegions().enqueue(new Callback<RegionResponse>() {
            @Override
            public void onResponse(Call<RegionResponse> call, Response<RegionResponse> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    regionAdapter.updateRegions(response.body().getRegions());
                } else {
                    Toast.makeText(RegionsActivity.this, "Error al cargar las regiones.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<RegionResponse> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(RegionsActivity.this, "Fallo de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}