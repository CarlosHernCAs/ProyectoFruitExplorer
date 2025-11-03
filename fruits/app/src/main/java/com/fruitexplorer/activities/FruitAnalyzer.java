package com.fruitexplorer.activities;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;

import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.task.vision.classifier.Classifications;
import org.tensorflow.lite.task.vision.classifier.ImageClassifier;

import java.io.IOException;
import java.util.List;

public class FruitAnalyzer implements ImageAnalysis.Analyzer {

    private static final String TAG = "FruitAnalyzer";
    private ImageClassifier imageClassifier;

    // Constructor para inicializar el clasificador
    public FruitAnalyzer(Context context) {
        try {
            // Configuración del clasificador
            ImageClassifier.ImageClassifierOptions options = ImageClassifier.ImageClassifierOptions.builder()
                    .setMaxResults(1) // Solo nos interesa el resultado más probable
                    .setScoreThreshold(0.7f) // Umbral de confianza mínimo (ajusta según necesites)
                    .build();

            // Creación del clasificador desde los archivos en 'assets'
            imageClassifier = ImageClassifier.createFromFileAndOptions(
                    context,
                    "model.tflite", // Asegúrate de que este sea el nombre de tu modelo
                    options
            );
        } catch (IOException e) {
            Log.e(TAG, "Error al inicializar el ImageClassifier.", e);
        }
    }

    @SuppressLint("UnsafeOptInUsageError")
    @Override
    public void analyze(@NonNull ImageProxy image) {
        if (imageClassifier == null) {
            image.close();
            return;
        }

        // Convertimos la imagen de CameraX a un formato que TensorFlow Lite entiende
        Bitmap bitmap = image.toBitmap();
        TensorImage tensorImage = TensorImage.fromBitmap(bitmap);

        // Ejecutamos la inferencia
        List<Classifications> results = imageClassifier.classify(tensorImage);

        // Procesamos los resultados
        if (results != null && !results.isEmpty() && !results.get(0).getCategories().isEmpty()) {
            String fruitName = results.get(0).getCategories().get(0).getLabel();
            float score = results.get(0).getCategories().get(0).getScore();
            Log.d(TAG, "Fruta detectada: " + fruitName + " con confianza: " + score);
        }

        // ¡Muy importante! Debemos cerrar la imagen para que la cámara pueda enviar la siguiente.
        image.close();
    }
}