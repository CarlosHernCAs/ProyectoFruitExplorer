package com.fruitexplorer.activities;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.Camera;
import androidx.core.app.ActivityCompat;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.constraintlayout.widget.Group;
import androidx.core.content.ContextCompat;

import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.BaseResponse;
import com.fruitexplorer.models.Fruit;
import com.fruitexplorer.models.LogQueryRequest;
import com.fruitexplorer.models.FruitResponse;
import com.fruitexplorer.utils.SessionManager;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

// 1. Implementamos la interfaz que creamos en FruitAnalyzer
public class CameraActivity extends AppCompatActivity implements FruitAnalyzer.FruitDetectionListener {

    private static final String TAG = "CameraActivity";
    private static final long DETECTION_CONFIRMATION_DELAY = 1500L; // 1.5 segundos

    private PreviewView viewFinder;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    private TextView detectionResultTextView;
    private Group confirmationGroup;
    private Button btnSeeDetails;
    private ImageButton btnRetry;

    private SessionManager sessionManager;
    private ApiService apiService;
    private String lastDetectedFruit = "";
    private String lockedFruit = null; // Fruta "bloqueada"
    private float lockedConfidence = 0.0f; // <<< NUEVO: Guardamos la confianza de la fruta bloqueada
    private boolean isDetectionPaused = false;

    private final Handler detectionHandler = new Handler(Looper.getMainLooper());
    private Runnable confirmationRunnable;

    // Executor para correr el análisis en un hilo separado y no bloquear la UI
    private ExecutorService cameraExecutor;
    // Cliente para obtener la ubicación
    private FusedLocationProviderClient fusedLocationClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        viewFinder = findViewById(R.id.viewFinder);
        detectionResultTextView = findViewById(R.id.detectionResultTextView);
        confirmationGroup = findViewById(R.id.confirmationGroup);
        btnSeeDetails = findViewById(R.id.btnSeeDetails);
        btnRetry = findViewById(R.id.btnRetry);

        sessionManager = new SessionManager(this);
        // Inicializamos el servicio de la API
        apiService = ApiClient.getApiService(this);

        // Inicializamos el cliente de ubicación
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // Creamos un hilo único para el análisis de imágenes
        cameraExecutor = Executors.newSingleThreadExecutor();

        // Solicitar el proveedor de la cámara
        cameraProviderFuture = ProcessCameraProvider.getInstance(this);

        // Configurar el listener para cuando el proveedor esté listo
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                startCamera(cameraProvider);
            } catch (Exception e) {
                Log.e(TAG, "Error al obtener el proveedor de la cámara.", e);
            }
        }, ContextCompat.getMainExecutor(this));

        btnRetry.setOnClickListener(v -> resetDetection());

        btnSeeDetails.setOnClickListener(v -> {
            if (lockedFruit != null) {
                // Muestra un Toast o un ProgressBar aquí si quieres feedback
                fetchFruitDetails(lockedFruit, lockedConfidence); // <<< CAMBIO: Pasamos también la confianza
            }
        });
    }

    private void startCamera(ProcessCameraProvider cameraProvider) {
        // Configurar el caso de uso de la vista previa (Preview)
        Preview preview = new Preview.Builder().build();

        // Seleccionar la cámara trasera por defecto
        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                .build();

        // Conectar la vista previa a la superficie de nuestro PreviewView
        preview.setSurfaceProvider(viewFinder.getSurfaceProvider());

        // Configurar el caso de uso del análisis de imágenes (ImageAnalysis)
        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                // Configura la resolución si es necesario, pero los valores por defecto suelen ser buenos para empezar
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST) // Solo nos interesa el último fotograma
                .build();

        // Asignamos nuestra clase analizadora al caso de uso
        // 2. Pasamos 'this' (la Activity) como el listener al constructor de FruitAnalyzer
        // El segundo parámetro es el Executor donde se ejecutará el método onFruitDetected
        // Usamos getMainExecutor para asegurar que la UI se actualice en el hilo principal.
        imageAnalysis.setAnalyzer(cameraExecutor, new FruitAnalyzer(this, this));

        // Desvincular cualquier caso de uso anterior y vincular los nuevos
        cameraProvider.unbindAll();

        if (!isDetectionPaused) {
            // Vinculamos ambos casos de uso: la vista previa y el análisis de imágenes
            cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis);
        } else {
            // Si está pausado, solo vinculamos la vista previa para que la imagen se quede congelada
            cameraProvider.bindToLifecycle(this, cameraSelector, preview);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Al volver a esta pantalla (ej. desde detalles), reiniciamos la detección.
        resetDetection();
    }

    private void resetDetection() {
        isDetectionPaused = false;
        lockedFruit = null;
        lockedConfidence = 0.0f; // <<< NUEVO: Reiniciamos la confianza
        lastDetectedFruit = "";
        confirmationGroup.setVisibility(View.GONE);
        detectionResultTextView.setText("Apuntando a una fruta...");

        if (cameraExecutor == null || cameraExecutor.isShutdown()) {
            cameraExecutor = Executors.newSingleThreadExecutor();
        }

        // Volvemos a vincular la cámara para reiniciar el análisis
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                startCamera(cameraProvider);
            } catch (Exception e) {
                Log.e(TAG, "Error al reiniciar la detección.", e);
            }
        }, ContextCompat.getMainExecutor(this));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Liberar el executor cuando la actividad se destruya
        cameraExecutor.shutdown();
    }

    // 3. Este método será llamado por FruitAnalyzer cada vez que detecte una fruta
    @Override
    public void onFruitDetected(String fruitName, float score) {
        if (isDetectionPaused) return;

        // Este código se ejecuta en el hilo principal, por lo que es seguro actualizar la UI
        runOnUiThread(() -> { // Aseguramos que se ejecute en el hilo de la UI
            String currentText = String.format("%s (%.2f%%)", fruitName, score * 100);
            detectionResultTextView.setText(currentText);

            // Si la fruta detectada es nueva, reiniciamos el temporizador de confirmación
            if (!fruitName.equals(lastDetectedFruit)) {
                lastDetectedFruit = fruitName;
                // Cancelamos cualquier confirmación pendiente
                if (confirmationRunnable != null) {
                    detectionHandler.removeCallbacks(confirmationRunnable);
                }
                // Creamos una nueva tarea de confirmación
                confirmationRunnable = () -> {
                    lockedFruit = fruitName;
                    lockedConfidence = score; // <<< NUEVO: Guardamos la confianza al bloquear
                    pauseDetection();
                    confirmationGroup.setVisibility(View.VISIBLE);
                };
                // Programamos la confirmación para dentro de 1.5 segundos
                detectionHandler.postDelayed(confirmationRunnable, DETECTION_CONFIRMATION_DELAY);
            }
        });
    }

    private void pauseDetection() {
        isDetectionPaused = true;
        // Para pausar, simplemente reiniciamos la cámara sin el caso de uso de análisis
        cameraProviderFuture.addListener(() -> {
            try {
                startCamera(cameraProviderFuture.get());
            } catch (Exception e) {
                Log.e(TAG, "Error al pausar la cámara.", e);
            }
        }, ContextCompat.getMainExecutor(this));
    }

    private void fetchFruitDetails(String fruitName, float confidence) {
        // Primero, intentamos obtener la ubicación
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(this, location -> {
                        String locationString = null;
                        if (location != null) {
                            locationString = location.getLatitude() + "," + location.getLongitude();
                        }
                        // Una vez tenemos la ubicación (o no), buscamos los detalles y pasamos la ubicación
                        fetchFruitDetailsApiCall(fruitName, locationString, confidence);
                    })
                    .addOnFailureListener(e -> {
                        // Si falla, continuamos sin ubicación
                        fetchFruitDetailsApiCall(fruitName, null, confidence);
                    });
        } else {
            // Si no hay permiso, continuamos sin ubicación
            fetchFruitDetailsApiCall(fruitName, null, confidence);
        }
    }

    private void fetchFruitDetailsApiCall(String fruitName, String location, float confidence) {
        apiService.getFruitBySlug(fruitName).enqueue(new Callback<FruitResponse>() {
            @Override
            public void onResponse(Call<FruitResponse> call, Response<FruitResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Fruit fruit = response.body().getFruit(); // <-- ¡Aquí está el cambio clave!

                    // Ahora que tenemos la fruta, registramos la consulta y luego abrimos los detalles
                    logQueryAndLaunchDetails(fruit, location, confidence);

                } else {
                    Log.w(TAG, "No se encontró información para la fruta: " + fruitName + " Código: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<FruitResponse> call, Throwable t) {
                Log.e(TAG, "Error al obtener detalles de la fruta: ", t);
                Toast.makeText(CameraActivity.this, "Error de red", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void logQueryAndLaunchDetails(Fruit fruit, String location, float confidence) {
        if (!sessionManager.isLoggedIn()) {
            launchFruitDetailActivity(fruit, -1); // Lanzar sin ID de consulta
            return;
        }

        // <<< CAMBIO CRÍTICO: Creamos el LogQueryRequest con todos los datos
        // Usamos un ID de modelo fijo (ej. 1) por ahora.
        LogQueryRequest request = new LogQueryRequest(fruit.getSlug(), location, confidence, 1);

        apiService.logQuery(request).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                long queryId = -1;
                if (response.isSuccessful() && response.body() != null) {
                    queryId = response.body().getQueryId();
                    Log.i(TAG, "Consulta registrada con ID: " + queryId);
                } else {
                    Log.e(TAG, "Error al registrar la consulta. Código: " + response.code());
                }
                launchFruitDetailActivity(fruit, queryId);
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                Log.e(TAG, "Fallo de red al registrar la consulta.", t);
                launchFruitDetailActivity(fruit, -1); // Lanzar sin ID si la red falla
            }
        });
    }

    private void launchFruitDetailActivity(Fruit fruit, long queryId) {
        Intent intent = new Intent(this, FruitDetailActivity.class);
        intent.putExtra(FruitDetailActivity.EXTRA_FRUIT_SLUG, fruit.getSlug());
        intent.putExtra(FruitDetailActivity.EXTRA_QUERY_ID, queryId);
        startActivity(intent);
    }
}