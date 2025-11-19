package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AnimationUtils;
import android.view.animation.LayoutAnimationController;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityOptionsCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.adapters.FruitAdapter;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.FruitListResponse;
import com.fruitexplorer.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExploreActivity extends AppCompatActivity implements FruitAdapter.OnFruitClickListener {
    private static final String TAG = "ExploreActivity";
    private SessionManager sessionManager;
    private ApiService apiService;

    private RecyclerView fruitsRecyclerView;
    private FruitAdapter fruitAdapter;
    private List<Fruit> currentFruits = new ArrayList<>();
    private FloatingActionButton fabCamera;
    private BottomNavigationView bottomNavigationView;
    private ShimmerFrameLayout shimmerLayout;
    private LinearLayout emptyStateLayout;
    private ImageView emptyStateIcon;
    private TextView emptyStateTextView;

    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_explore);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        sessionManager = new SessionManager(this);
        apiService = ApiClient.getApiService(this);

        fruitsRecyclerView = findViewById(R.id.fruitsRecyclerView);
        fabCamera = findViewById(R.id.fabCamera);
        bottomNavigationView = findViewById(R.id.bottomNavigationView);
        shimmerLayout = findViewById(R.id.shimmerLayout);
        emptyStateLayout = findViewById(R.id.emptyStateLayout);
        emptyStateIcon = findViewById(R.id.emptyStateIcon);
        emptyStateTextView = findViewById(R.id.emptyStateTextView);

        setupRecyclerView();
        setupBottomNavigation();

        fetchFruits(null);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.explore_toolbar_menu, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                handler.removeCallbacksAndMessages(null);
                fetchFruits(query);
                searchView.clearFocus();
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                handler.removeCallbacksAndMessages(null);
                handler.postDelayed(() -> fetchFruits(newText), 300);
                return true;
            }
        });

        searchItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
            @Override
            public boolean onMenuItemActionExpand(MenuItem item) {
                setAppBarExpanded(true, true);
                return true;
            }

            @Override
            public boolean onMenuItemActionCollapse(MenuItem item) {
                setAppBarExpanded(true, false);
                invalidateOptionsMenu();
                return true;
            }
        });

        return super.onCreateOptionsMenu(menu);
    }

    private void setAppBarExpanded(boolean expanded, boolean isSearchActive) {
        com.google.android.material.appbar.AppBarLayout appBarLayout = findViewById(R.id.appBarLayout);
        appBarLayout.setExpanded(expanded, true);

        androidx.coordinatorlayout.widget.CoordinatorLayout.LayoutParams params =
                (androidx.coordinatorlayout.widget.CoordinatorLayout.LayoutParams) appBarLayout.getLayoutParams();
        com.google.android.material.appbar.AppBarLayout.Behavior behavior =
                (com.google.android.material.appbar.AppBarLayout.Behavior) params.getBehavior();

        if (behavior != null) {
            behavior.setDragCallback(new com.google.android.material.appbar.AppBarLayout.Behavior.DragCallback() {
                @Override
                public boolean canDrag(com.google.android.material.appbar.AppBarLayout appBarLayout) {
                    return !isSearchActive;
                }
            });
        }
    }

    private void setupRecyclerView() {
        fruitsRecyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        fruitAdapter = new FruitAdapter(this, new ArrayList<>(), this);
        fruitsRecyclerView.setAdapter(fruitAdapter);
        
        LayoutAnimationController animation = AnimationUtils.loadLayoutAnimation(this, R.anim.layout_animation_fall_down);
        fruitsRecyclerView.setLayoutAnimation(animation);
    }

    private void setupBottomNavigation() {
        fabCamera.setOnClickListener(v -> {
            startActivity(new Intent(this, CameraActivity.class));
        });

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.navigation_regions) {
                startActivity(new Intent(this, RegionsActivity.class));
                return true;
            } else if (itemId == R.id.navigation_recipes) {
                startActivity(new Intent(this, RecipesActivity.class));
                return true;
            }
            return false;
        });
    }

    private void showLoading(boolean show) {
        if (show) {
            shimmerLayout.setVisibility(View.VISIBLE);
            shimmerLayout.startShimmer();
            fruitsRecyclerView.setVisibility(View.GONE);
            emptyStateLayout.setVisibility(View.GONE);
        } else {
            shimmerLayout.stopShimmer();
            shimmerLayout.setVisibility(View.GONE);
            fruitsRecyclerView.setVisibility(View.VISIBLE);
        }
    }

    private void showEmptyState(String message, int iconResId) {
        shimmerLayout.setVisibility(View.GONE);
        fruitsRecyclerView.setVisibility(View.GONE);
        emptyStateLayout.setVisibility(View.VISIBLE);
        emptyStateTextView.setText(message);
        emptyStateIcon.setImageResource(iconResId);
    }

    
    private void fetchFruits(String query) {
        showLoading(true);
        String actualQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        apiService.listFruits(actualQuery).enqueue(new Callback<FruitListResponse>() {
            @Override
            public void onResponse(Call<FruitListResponse> call, Response<FruitListResponse> response) {
                showLoading(false);
                if (response.isSuccessful() && response.body() != null && response.body().getFruits() != null) {
                    currentFruits.clear();
                    currentFruits.addAll(response.body().getFruits());
                    fruitAdapter.updateFruits(currentFruits);

                    if (currentFruits.isEmpty()) {
                        showEmptyState("No se encontraron frutas.", R.drawable.ic_public);
                    }
                } else {
                    showEmptyState("Error al cargar frutas.", R.drawable.ic_public);
                    Log.e(TAG, "Error al cargar frutas: " + response.code() + " - " + response.message());
                }
            }

            @Override
            public void onFailure(Call<FruitListResponse> call, Throwable t) {
                showLoading(false);
                showEmptyState("Error de conexión.", R.drawable.ic_public);
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
}