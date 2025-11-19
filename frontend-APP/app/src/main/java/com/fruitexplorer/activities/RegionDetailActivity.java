package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityOptionsCompat;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.adapters.FruitAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.FruitListResponse;
import com.fruitexplorer.models.Region;
import com.google.android.material.appbar.CollapsingToolbarLayout;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegionDetailActivity extends AppCompatActivity {

    public static final String EXTRA_REGION = "extra_region";

    private ApiService apiService;
    private RecyclerView fruitsRecyclerView;
    private FruitAdapter fruitAdapter;
    private ProgressBar progressBar;
    private Region region;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_region_detail);

        region = getIntent().getParcelableExtra(EXTRA_REGION);
        if (region == null) {
            Toast.makeText(this, "No se pudo cargar la región.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        apiService = ApiClient.getApiService(this);

        setupToolbar();
        initViews();
        setupRecyclerView();
        fetchFruitsForRegion();
    }

    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        CollapsingToolbarLayout collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        collapsingToolbar.setTitle(region.getName());
    }

    private void initViews() {
        ImageView regionImageView = findViewById(R.id.regionImageView);
        TextView regionDescriptionTextView = findViewById(R.id.regionDescriptionTextView);
        fruitsRecyclerView = findViewById(R.id.fruitsRecyclerView);
        progressBar = findViewById(R.id.progressBar);

        regionDescriptionTextView.setText(region.getDescription());
        Glide.with(this).load(region.getImageUrl()).into(regionImageView);
    }

    private void setupRecyclerView() {
        fruitsRecyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        fruitAdapter = new FruitAdapter(this, new ArrayList<>(), (fruit, fruitImageView) -> {
            Intent intent = new Intent(this, FruitDetailActivity.class);
            intent.putExtra(FruitDetailActivity.EXTRA_FRUIT_SLUG, fruit.getSlug());

            ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(
                    this,
                    fruitImageView,
                    "fruit_image"
            );
            startActivity(intent, options.toBundle());
        });
        fruitsRecyclerView.setAdapter(fruitAdapter);
    }

    private void fetchFruitsForRegion() {
        progressBar.setVisibility(View.VISIBLE);
        apiService.getFruitsByRegion(region.getId()).enqueue(new Callback<FruitListResponse>() {
            @Override
            public void onResponse(Call<FruitListResponse> call, Response<FruitListResponse> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    fruitAdapter.updateFruits(response.body().getFruits());
                } else {
                    Toast.makeText(RegionDetailActivity.this, "No se encontraron frutas para esta región.", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<FruitListResponse> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(RegionDetailActivity.this, "Error de conexión.", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}