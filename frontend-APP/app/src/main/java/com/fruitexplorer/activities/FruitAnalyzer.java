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

    public interface FruitDetectionListener {
        void onFruitDetected(String fruitName, float score);
    }

    private static final String TAG = "FruitAnalyzer";
    private ImageClassifier imageClassifier;
    private List<String> labels;
    private final FruitDetectionListener listener;

    public FruitAnalyzer(Context context, FruitDetectionListener listener) {
        this.listener = listener;
        try {
            ImageClassifier.ImageClassifierOptions options = ImageClassifier.ImageClassifierOptions.builder()
                    .setMaxResults(1)
                    .setScoreThreshold(0.7f)
                    .build();

            imageClassifier = ImageClassifier.createFromFileAndOptions(
                    context,
                    "model.tflite",
                    options
            );
        } catch (IOException e) {
            Log.e(TAG, "Error al inicializar el ImageClassifier.", e);
        }

        loadLabels(context);
    }

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

        Bitmap bitmap = image.toBitmap();
        TensorImage tensorImage = TensorImage.fromBitmap(bitmap);

        List<Classifications> results = imageClassifier.classify(tensorImage);

        if (results != null && !results.isEmpty() && !results.get(0).getCategories().isEmpty()) {
            Category topCategory = results.get(0).getCategories().get(0);
            float score = topCategory.getScore();

            int categoryIndex = topCategory.getIndex();

            if (labels != null && categoryIndex >= 0 && categoryIndex < labels.size()) {
                String fruitName = labels.get(categoryIndex);
                listener.onFruitDetected(fruitName, score);
            }
        }

        image.close();
    }
}