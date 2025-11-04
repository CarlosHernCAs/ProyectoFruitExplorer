package com.fruitexplorer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.fruitexplorer.R;
import com.fruitexplorer.fragments.MapFragment;
import com.fruitexplorer.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class ExploreActivity extends AppCompatActivity {
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_explore);

        sessionManager = new SessionManager(this);

        TextView welcomeTextView = findViewById(R.id.welcomeText);

        // Personalizar el mensaje de bienvenida 
        String displayName = sessionManager.getUserDisplayName();
        welcomeTextView.setText("¡Hola de nuevo, " + displayName + "!");

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.navigation_map) {
                loadFragment(new MapFragment());
                return true;
            } else if (itemId == R.id.navigation_camera) {
                startActivity(new Intent(ExploreActivity.this, CameraActivity.class));
                return false; // Devuelve false para que el ítem no quede seleccionado
            }
            return false;
        });

        // Cargar el fragmento del mapa por defecto al iniciar la actividad
        if (savedInstanceState == null) {
            bottomNav.setSelectedItemId(R.id.navigation_map);
        }
    }

    private void loadFragment(Fragment fragment) {
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction transaction = fm.beginTransaction();
        transaction.replace(R.id.nav_host_fragment, fragment);
        transaction.commit();
    }
}
