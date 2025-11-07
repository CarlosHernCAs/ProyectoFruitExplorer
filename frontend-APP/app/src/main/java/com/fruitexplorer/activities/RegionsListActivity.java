package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.RegionAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Region;
import com.fruitexplorer.models.RegionResponse;
import com.google.android.material.appbar.MaterialToolbar;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegionsListActivity extends AppCompatActivity implements RegionAdapter.OnRegionClickListener {

    private static final String TAG = "RegionsListActivity";
    private RecyclerView regionsRecyclerView;
    private RegionAdapter regionAdapter;
    private List<Region> regionList = new ArrayList<>();
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_regions_list);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        apiService = ApiClient.getApiService(this);
        regionsRecyclerView = findViewById(R.id.regionsRecyclerView);
        setupRecyclerView();

        fetchRegions();
    }

    private void setupRecyclerView() {
        regionsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        regionAdapter = new RegionAdapter(this, regionList, this);
        regionsRecyclerView.setAdapter(regionAdapter);
    }

    private void fetchRegions() {
        apiService.getRegions().enqueue(new Callback<RegionResponse>() {
            @Override
            public void onResponse(Call<RegionResponse> call, Response<RegionResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getRegions() != null) {
                    regionAdapter.updateData(response.body().getRegions());
                } else {
                    Toast.makeText(RegionsListActivity.this, "No se pudieron cargar las regiones.", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<RegionResponse> call, Throwable t) {
                Log.e(TAG, "Error de red al cargar regiones: ", t);
                Toast.makeText(RegionsListActivity.this, "Error de conexión.", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onRegionClick(Region region) {
        Intent intent = new Intent(this, RegionFruitsActivity.class);
        intent.putExtra("REGION_ID", region.getId());
        intent.putExtra("REGION_NAME", region.getName());
        startActivity(intent);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}