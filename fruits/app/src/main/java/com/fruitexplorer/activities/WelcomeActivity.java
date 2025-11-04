package com.fruitexplorer.activities; // El nombre del archivo debe ser WelcomeActivity.java

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.fruitexplorer.R;
import com.fruitexplorer.utils.SessionManager;

public class WelcomeActivity extends AppCompatActivity {

    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 101;

    private SessionManager sessionManager;
    private TextView welcomeTextView;
    private Button btnContinue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        sessionManager = new SessionManager(this);

        welcomeTextView = findViewById(R.id.welcomeText);
        btnContinue = findViewById(R.id.btnContinue);

        // Personalizar el mensaje de bienvenida
        String displayName = sessionManager.getUserDisplayName();
        welcomeTextView.setText("¡Bienvenido a FruitExplorer, " + displayName + "!");

        btnContinue.setOnClickListener(v -> {
            checkCameraPermissionAndProceed();
        });

        // Pedimos los permisos necesarios al iniciar esta pantalla.
        // El usuario no podrá continuar hasta que acepte el de la cámara.
        checkLocationPermission();
    }

    private void checkCameraPermissionAndProceed() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            // El permiso ya está concedido, abrir la cámara
            goToExploreActivity();
        } else if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
            // El usuario ya ha denegado el permiso antes. Muestra una explicación.
            showPermissionRationaleDialog();
        } else {
            // El permiso no está concedido y es la primera vez (o el usuario marcó "no volver a preguntar"), solicitarlo.
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST_CODE);
        }
    }

    private void checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // Si no tenemos el permiso, lo solicitamos. No bloqueamos la UI si no lo dan.
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            // No hacemos nada especial si lo deniegan, la app puede funcionar sin ubicación.
            Toast.makeText(this, "Permiso de ubicación procesado.", Toast.LENGTH_SHORT).show();
        } else if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // El usuario concedió el permiso
                goToExploreActivity();
            } else {
                // El usuario denegó el permiso.
                // Si shouldShowRequestPermissionRationale es false, significa que el usuario marcó "No volver a preguntar".
                if (!ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                    // Guiar al usuario a la configuración de la app.
                    new AlertDialog.Builder(this)
                            .setTitle("Permiso Denegado Permanentemente")
                            .setMessage("Para usar esta función, necesitas habilitar el permiso de la cámara manualmente en los ajustes de la aplicación.")
                            .setPositiveButton("Ir a Ajustes", (dialog, which) -> {
                                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                Uri uri = Uri.fromParts("package", getPackageName(), null);
                                intent.setData(uri);
                                startActivity(intent);
                            })
                            .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss())
                            .create().show();
                } else {
                    Toast.makeText(this, "Permiso de cámara denegado.", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    private void showPermissionRationaleDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Permiso Necesario")
                .setMessage("Esta función requiere acceso a la cámara para poder identificar frutas. Por favor, concede el permiso.")
                .setPositiveButton("Aceptar", (dialog, which) -> {
                    // Vuelve a solicitar el permiso
                    ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST_CODE);
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss())
                .create()
                .show();
    }

    private void goToExploreActivity() {
        // Marcamos que la pantalla de bienvenida ya se ha visto.
        sessionManager.setWelcomeScreenSeen();
        Intent intent = new Intent(this, ExploreActivity.class);
        startActivity(intent);
        finish(); // Cerramos esta actividad para que el usuario no pueda volver.
    }
}