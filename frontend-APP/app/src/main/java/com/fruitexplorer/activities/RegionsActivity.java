package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Region;
import com.fruitexplorer.models.RegionResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegionsActivity extends AppCompatActivity {

    private ApiService apiService;
    private View regionCard1, regionCard2, regionCard3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_regions);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Regiones");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        apiService = ApiClient.getApiService(this);
        initViews();
        fetchAndDisplayRegions();
    }

    private void initViews() {
        regionCard1 = findViewById(R.id.region_card_1);
        regionCard2 = findViewById(R.id.region_card_2);
        regionCard3 = findViewById(R.id.region_card_3);

        regionCard1.setVisibility(View.GONE);
        regionCard2.setVisibility(View.GONE);
        regionCard3.setVisibility(View.GONE);
    }

    private void fetchAndDisplayRegions() {
        apiService.getRegions().enqueue(new Callback<RegionResponse>() {
            @Override
            public void onResponse(Call<RegionResponse> call, Response<RegionResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Region> regions = response.body().getRegions();
                    if (regions != null && regions.size() >= 3) {
                        setupRegionCard(regionCard1, regions.get(0), 0);
                        setupRegionCard(regionCard2, regions.get(1), 150);
                        setupRegionCard(regionCard3, regions.get(2), 300);
                    }
                } else {
                    Toast.makeText(RegionsActivity.this, "Error al cargar las regiones.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<RegionResponse> call, Throwable t) {
                Toast.makeText(RegionsActivity.this, "Fallo de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupRegionCard(View cardView, final Region region, long startDelay) {
        cardView.setVisibility(View.INVISIBLE);

        TextView nameTextView = cardView.findViewById(R.id.regionNameTextView);
        ImageView imageView = cardView.findViewById(R.id.regionImageView);

        nameTextView.setText(region.getName());
        Glide.with(this)
                .load(region.getImageUrl())
                .into(imageView);

        cardView.setOnClickListener(v -> {
            Intent intent = new Intent(RegionsActivity.this, RegionDetailActivity.class);
            intent.putExtra(RegionDetailActivity.EXTRA_REGION, region);
            startActivity(intent);
        });

        cardView.setVisibility(View.VISIBLE);
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.card_slide_up_fade_in);
        animation.setStartOffset(startDelay);
        cardView.startAnimation(animation);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}