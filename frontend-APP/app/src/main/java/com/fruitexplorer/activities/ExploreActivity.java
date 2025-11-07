package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
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
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExploreActivity extends AppCompatActivity implements FruitAdapter.OnFruitClickListener {
    private static final String TAG = "ExploreActivity";
    private SessionManager sessionManager;
    private ApiService apiService;

    private TextInputEditText searchInput;
    private RecyclerView fruitsRecyclerView;
    private FruitAdapter fruitAdapter;
    private List<Fruit> currentFruits = new ArrayList<>(); // Usaremos esta lista para el adaptador
    private FloatingActionButton fabCamera;
    private BottomNavigationView bottomNavigationView;

    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_explore);

        // Inicialización
        sessionManager = new SessionManager(this);
        apiService = ApiClient.getApiService(this);

        TextView welcomeTextView = findViewById(R.id.welcomeText);
        searchInput = findViewById(R.id.searchInput);
        fruitsRecyclerView = findViewById(R.id.fruitsRecyclerView);
        fabCamera = findViewById(R.id.fabCamera);
        bottomNavigationView = findViewById(R.id.bottomNavigationView);

        // Personalizar el mensaje de bienvenida 
        String displayName = sessionManager.getUserDisplayName();
        welcomeTextView.setText("¡Hola de nuevo, " + displayName + "!");

        setupRecyclerView();
        setupSearch();
        setupBottomNavigation();

        // Cargar todas las frutas al iniciar
        fetchFruits(null); // Cargar todas las frutas inicialmente
    }

    private void setupRecyclerView() {
        fruitsRecyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        fruitAdapter = new FruitAdapter(this, new ArrayList<>(), this);
        fruitsRecyclerView.setAdapter(fruitAdapter);
    }

    private void setupSearch() {
        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // Cancelar cualquier búsqueda anterior pendiente
                handler.removeCallbacksAndMessages(null);
                // Programar una nueva búsqueda después de un breve retraso
                handler.postDelayed(() -> fetchFruits(s.toString()), 300); // Retraso de 300ms
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void setupBottomNavigation() {
        fabCamera.setOnClickListener(v -> {
            startActivity(new Intent(this, CameraActivity.class));
        });

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.navigation_regions) {
                startActivity(new Intent(this, RegionsListActivity.class));
                return true;
            } else if (itemId == R.id.navigation_recipes) {
                Toast.makeText(this, "Próximamente: Lista de Recetas", Toast.LENGTH_SHORT).show();
                return true;
            }
            return false;
        });
    }
    
    private void fetchFruits(String query) {
        // Si la consulta está vacía, pasamos null para obtener todas las frutas
        String actualQuery = query != null && query.isEmpty() ? null : query;

        apiService.listFruits(actualQuery).enqueue(new Callback<FruitListResponse>() {
            @Override
            public void onResponse(Call<FruitListResponse> call, Response<FruitListResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getFruits() != null) {
                    currentFruits.clear();
                    currentFruits.addAll(response.body().getFruits());
                    fruitAdapter.updateData(currentFruits); // Actualizar el adaptador con los nuevos datos
                    if (currentFruits.isEmpty()) {
                        Toast.makeText(ExploreActivity.this, "No se encontraron frutas.", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(ExploreActivity.this, "Error al cargar frutas: " + response.code(), Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "Error al cargar frutas: " + response.code() + " - " + response.message());
                    fruitAdapter.updateData(new ArrayList<>()); // Limpiar la lista si hay error
                }
            }

            @Override
            public void onFailure(Call<FruitListResponse> call, Throwable t) {
                Toast.makeText(ExploreActivity.this, "Error de conexión al cargar frutas.", Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Error de red al cargar frutas: ", t);
                fruitAdapter.updateData(new ArrayList<>()); // Limpiar la lista si hay error de red
            }
        }
        );
    }

    @Override
    public void onFruitClick(Fruit fruit) {
        Intent intent = new Intent(this, FruitDetailActivity.class);
        intent.putExtra(FruitDetailActivity.EXTRA_FRUIT, fruit);
        startActivity(intent);
    }
}
