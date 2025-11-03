package com.fruitexplorer.activities;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;

import com.fruitexplorer.R;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CameraActivity extends AppCompatActivity {

    private static final String TAG = "CameraActivity";
    private PreviewView viewFinder;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    // Executor para correr el análisis en un hilo separado y no bloquear la UI
    private ExecutorService cameraExecutor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        viewFinder = findViewById(R.id.viewFinder);

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
        imageAnalysis.setAnalyzer(cameraExecutor, new FruitAnalyzer(this));

        // Desvincular cualquier caso de uso anterior y vincular los nuevos
        cameraProvider.unbindAll();
        // Vinculamos ambos casos de uso: la vista previa y el análisis de imágenes
        cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Liberar el executor cuando la actividad se destruya
        cameraExecutor.shutdown();
    }
}