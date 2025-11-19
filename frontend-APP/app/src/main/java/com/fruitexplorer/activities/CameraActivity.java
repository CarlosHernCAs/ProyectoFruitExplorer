package com.fruitexplorer.activities;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
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
import android.widget.LinearLayout;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CameraActivity extends AppCompatActivity implements FruitAnalyzer.FruitDetectionListener {

    private static final String TAG = "CameraActivity";
    private static final long DETECTION_CONFIRMATION_DELAY = 1500L;

    private PreviewView viewFinder;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    private TextView detectionResultTextView;
    private LinearLayout confirmationGroup;
    private Button btnSeeDetails;
    private Button btnRetry;
    private ProgressBar detectionProgress;
    private ProgressBar loadingIndicator;

    private SessionManager sessionManager;
    private ApiService apiService;
    private String lastDetectedFruit = "";
    private String lockedFruit = null;
    private float lockedConfidence = 0.0f;
    private boolean isDetectionPaused = false;

    private final Handler detectionHandler = new Handler(Looper.getMainLooper());
    private Runnable confirmationRunnable;

    private ExecutorService cameraExecutor;
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
        detectionProgress = findViewById(R.id.detectionProgress);
        loadingIndicator = findViewById(R.id.loadingIndicator);

        sessionManager = new SessionManager(this);
        apiService = ApiClient.getApiService(this);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        cameraExecutor = Executors.newSingleThreadExecutor();

        cameraProviderFuture = ProcessCameraProvider.getInstance(this);

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
                showLoadingUI(true);
                fetchFruitDetails(lockedFruit, lockedConfidence);
            }
        });
    }

    private void startCamera(ProcessCameraProvider cameraProvider) {
        Preview preview = new Preview.Builder().build();

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                .build();

        preview.setSurfaceProvider(viewFinder.getSurfaceProvider());

        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build();

        imageAnalysis.setAnalyzer(cameraExecutor, new FruitAnalyzer(this, this));

        cameraProvider.unbindAll();

        if (!isDetectionPaused) {
            cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis);
        } else {
            cameraProvider.bindToLifecycle(this, cameraSelector, preview);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        resetDetection();
    }

    private void resetDetection() {
        isDetectionPaused = false;
        lockedFruit = null;
        lockedConfidence = 0.0f;
        lastDetectedFruit = "";
        confirmationGroup.setAlpha(0f);
        confirmationGroup.setVisibility(View.GONE);
        detectionProgress.setVisibility(View.GONE);
        detectionResultTextView.setText("Apuntando a una fruta...");

        if (cameraExecutor == null || cameraExecutor.isShutdown()) {
            cameraExecutor = Executors.newSingleThreadExecutor();
        }

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
        cameraExecutor.shutdown();
    }

    @Override
    public void onFruitDetected(String fruitName, float score) {
        if (isDetectionPaused) return;

        runOnUiThread(() -> {
            if (!fruitName.equals(lastDetectedFruit)) {
                detectionHandler.removeCallbacks(confirmationRunnable);

                lastDetectedFruit = fruitName;
                updateDetectionUI(fruitName, score, true);

                confirmationRunnable = () -> {
                    lockedFruit = fruitName;
                    lockedConfidence = score;
                    pauseDetection();
                    showConfirmationUI();
                };
                detectionHandler.postDelayed(confirmationRunnable, DETECTION_CONFIRMATION_DELAY);
            }
        });
    }

    private void pauseDetection() {
        isDetectionPaused = true;
        cameraProviderFuture.addListener(() -> {
            try {
                startCamera(cameraProviderFuture.get());
            } catch (Exception e) {
                Log.e(TAG, "Error al pausar la cámara.", e);
            }
        }, ContextCompat.getMainExecutor(this));
    }

    private void fetchFruitDetails(String fruitName, float confidence) {
        showLoadingUI(true);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(this, location -> {
                        String locationString = null;
                        if (location != null) {
                            locationString = location.getLatitude() + "," + location.getLongitude();
                        }
                        fetchFruitDetailsApiCall(fruitName, locationString, confidence);
                    })
                    .addOnFailureListener(e -> {
                        fetchFruitDetailsApiCall(fruitName, null, confidence);
                    });
        } else {
            fetchFruitDetailsApiCall(fruitName, null, confidence);
        }
    }

    private void fetchFruitDetailsApiCall(String fruitName, String location, float confidence) {
        apiService.getFruitBySlug(fruitName).enqueue(new Callback<FruitResponse>() {
            @Override
            public void onResponse(Call<FruitResponse> call, Response<FruitResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Fruit fruit = response.body().getFruit();

                    logQueryAndLaunchDetails(fruit, location, confidence);

                } else {
                    showLoadingUI(false);
                    Log.w(TAG, "No se encontró información para la fruta: " + fruitName + " Código: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<FruitResponse> call, Throwable t) {
                showLoadingUI(false);
                Log.e(TAG, "Error al obtener detalles de la fruta: ", t);
                Toast.makeText(CameraActivity.this, "Error de red", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void logQueryAndLaunchDetails(Fruit fruit, String location, float confidence) {
        if (!sessionManager.isLoggedIn()) {
            launchFruitDetailActivity(fruit, -1);
            return;
        }

        String deviceInfo = getDeviceInfoJson();
        LogQueryRequest request = new LogQueryRequest(fruit.getSlug(), location, confidence, 1, deviceInfo);
        
        apiService.logQuery(request).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                long queryId = -1;
                if (response.isSuccessful() && response.body() != null) {
                    queryId = response.body().getQueryId();
                    Log.i(TAG, "Consulta registrada con ID: " + queryId);
                } else {
                    showLoadingUI(false);
                    Log.e(TAG, "Error al registrar la consulta. Código: " + response.code());
                }
                launchFruitDetailActivity(fruit, queryId);
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                showLoadingUI(false);
                Log.e(TAG, "Fallo de red al registrar la consulta.", t);
                launchFruitDetailActivity(fruit, -1);
            }
        });
    }

    private void launchFruitDetailActivity(Fruit fruit, long queryId) {
        Intent intent = new Intent(this, FruitDetailActivity.class);
        intent.putExtra(FruitDetailActivity.EXTRA_FRUIT_SLUG, fruit.getSlug());
        intent.putExtra(FruitDetailActivity.EXTRA_QUERY_ID, queryId);
        startActivity(intent);
    }

    private void updateDetectionUI(String fruitName, float score, boolean isConfirming) {
        String currentText = String.format("%s (%.2f%%)", fruitName, score * 100);
        detectionResultTextView.setText(currentText);
        detectionProgress.setVisibility(isConfirming ? View.VISIBLE : View.GONE);
    }

    private void showConfirmationUI() {
        detectionProgress.setVisibility(View.GONE);

        confirmationGroup.setAlpha(0f);
        confirmationGroup.setTranslationY(50);
        confirmationGroup.setVisibility(View.VISIBLE);

        confirmationGroup.animate()
                .alpha(1f)
                .translationY(0)
                .setDuration(300)
                .start();
    }

    private void showLoadingUI(boolean isLoading) {
        if (isLoading) {
            loadingIndicator.setVisibility(View.VISIBLE);
            btnSeeDetails.setEnabled(false);
            btnRetry.setEnabled(false);
        } else {
            loadingIndicator.setVisibility(View.GONE);
            btnSeeDetails.setEnabled(true);
            btnRetry.setEnabled(true);
        }
    }

    private String getDeviceInfoJson() {
        JSONObject deviceInfo = new JSONObject();
        try {
            deviceInfo.put("manufacturer", Build.MANUFACTURER);
            deviceInfo.put("model", Build.MODEL);
            deviceInfo.put("os_version", Build.VERSION.RELEASE);
            deviceInfo.put("sdk_int", Build.VERSION.SDK_INT);
        } catch (JSONException e) {
            Log.e(TAG, "Error al crear el JSON de información del dispositivo", e);
            return "{}";
        }
        return deviceInfo.toString();
    }

}