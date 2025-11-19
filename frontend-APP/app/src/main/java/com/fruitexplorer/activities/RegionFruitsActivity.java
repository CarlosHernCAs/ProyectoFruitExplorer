package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityOptionsCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.FruitAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.FruitListResponse;

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
        fruitsRecyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        fruitAdapter = new FruitAdapter(this, fruitList, this);
        fruitsRecyclerView.setAdapter(fruitAdapter);
    }

    private void fetchFruits(int regionId) {
        apiService.getFruitsByRegion(regionId).enqueue(new Callback<FruitListResponse>() {
            @Override
            public void onResponse(Call<FruitListResponse> call, Response<FruitListResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getFruits() != null) {
                    fruitAdapter.updateFruits(response.body().getFruits());
                } else {
                    Toast.makeText(RegionFruitsActivity.this, "No se encontraron frutas para esta región.", Toast.LENGTH_LONG).show();
                }
            }
            @Override
            public void onFailure(Call<FruitListResponse> call, Throwable t) {
                Log.e(TAG, "Error de red al cargar frutas: ", t);
            }
        });
    }

    @Override
    public void onFruitClick(Fruit fruit, ImageView fruitImageView) {
        Intent intent = new Intent(this, FruitDetailActivity.class);
        intent.putExtra(FruitDetailActivity.EXTRA_FRUIT_SLUG, fruit.getSlug());

        ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(
                this,
                fruitImageView,
                "fruit_image"
        );

        startActivity(intent, options.toBundle());
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}