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
import org.tensorflow.lite.support.label.Category;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class FruitAnalyzer implements ImageAnalysis.Analyzer {

    // 1. Definimos la interfaz de callback
    public interface FruitDetectionListener {
        void onFruitDetected(String fruitName, float score);
    }

    private static final String TAG = "FruitAnalyzer";
    private ImageClassifier imageClassifier;
    // Lista para guardar las etiquetas (nombres de las frutas)
    private List<String> labels;
    // 2. Añadimos una variable para nuestro listener
    private final FruitDetectionListener listener;

    // Constructor para inicializar el clasificador
    public FruitAnalyzer(Context context, FruitDetectionListener listener) {
        this.listener = listener; // Guardamos la referencia al listener
        try {
            // Configuración del clasificador
            ImageClassifier.ImageClassifierOptions options = ImageClassifier.ImageClassifierOptions.builder()
                    .setMaxResults(1) // Solo nos interesa el resultado más probable
                    .setScoreThreshold(0.7f) // Umbral de confianza mínimo (ajusta según necesites)
                    .build();

            // Creación del clasificador desde los archivos en 'assets'
            // Se ha modificado para incluir el archivo de etiquetas (labels.txt).
            // TensorFlow Lite ahora asociará el índice 0 con la primera línea de labels.txt ("aguaje"),
            // el índice 1 con la segunda ("lucuma"), y así sucesivamente.
            imageClassifier = ImageClassifier.createFromFileAndOptions(
                    context,
                    "model.tflite", // Nombre del modelo
                    options
            );
        } catch (IOException e) {
            Log.e(TAG, "Error al inicializar el ImageClassifier.", e);
        }

        // Cargamos las etiquetas desde el archivo assets/labels.txt
        loadLabels(context);
    }

    // Nuevo método para leer el archivo de etiquetas
    private void loadLabels(Context context) {
        labels = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(context.getAssets().open("labels.txt")))) {
            String line;
            while ((line = reader.readLine()) != null) {
                labels.add(line);
            }
        } catch (IOException e) {
            Log.e(TAG, "Error al cargar el archivo de etiquetas (labels.txt).", e);
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
            // Obtenemos la categoría con la puntuación más alta
            Category topCategory = results.get(0).getCategories().get(0);
            float score = topCategory.getScore();

            // Obtenemos el ÍNDICE de la categoría (ej: 0 o 1)
            int categoryIndex = topCategory.getIndex();

            // Usamos el índice para buscar el nombre en nuestra lista de etiquetas
            // Asegurándonos de que el índice sea válido para evitar errores
            if (labels != null && categoryIndex >= 0 && categoryIndex < labels.size()) {
                String fruitName = labels.get(categoryIndex);
                // 3. Usamos el listener para notificar a la Activity
                // Esto se ejecutará en el hilo de la UI gracias a la configuración que haremos en CameraActivity
                listener.onFruitDetected(fruitName, score);
            }
        }

        // ¡Muy importante! Debemos cerrar la imagen para que la cámara pueda enviar la siguiente.
        image.close();
    }
}