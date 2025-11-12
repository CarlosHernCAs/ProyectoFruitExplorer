package com.fruitexplorer.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.media.Image;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;

import org.tensorflow.lite.support.image.ImageProcessor;
import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.support.image.ops.Rot90Op;
import org.tensorflow.lite.task.core.BaseOptions;
import org.tensorflow.lite.task.vision.classifier.ImageClassifier;
// CORRECCIÓN: Importamos las clases correctas de la nueva API de TFLite
import org.tensorflow.lite.task.vision.classifier.Classifications;
import org.tensorflow.lite.support.label.Category;

import java.io.IOException;
import java.util.List;

public class FruitAnalyzer implements ImageAnalysis.Analyzer {

    private static final String TAG = "FruitAnalyzer";

    // 1. Se modifica la interfaz para que el método incluya la confianza (score)
    public interface FruitDetectionListener {
        void onFruitDetected(String fruitName, float score);
    }

    private final ImageClassifier imageClassifier;
    private final FruitDetectionListener listener;

    public FruitAnalyzer(Context context, FruitDetectionListener listener) throws IOException {
        this.listener = listener;

        // Configuración del modelo de TensorFlow Lite
        ImageClassifier.ImageClassifierOptions options = ImageClassifier.ImageClassifierOptions.builder()
                .setBaseOptions(BaseOptions.builder().useNnapi().build())
                .setMaxResults(1) // Solo nos interesa el resultado más probable
                .build();

        // Creamos el clasificador de imágenes desde los assets
        this.imageClassifier = ImageClassifier.createFromFileAndOptions(
                context,
                "model.tflite", // Asegúrate de que tu modelo se llame así en la carpeta assets
                options
        );
    }

    @Override
    public void analyze(@NonNull ImageProxy image) {
        // Obtenemos la rotación de la imagen para corregirla si es necesario
        int rotationDegrees = image.getImageInfo().getRotationDegrees();

        // Convertimos la imagen del ImageProxy a un TensorImage, que es el formato que TFLite entiende
        TensorImage tensorImage = TensorImage.fromBitmap(toBitmap(image));

        // Procesamos la imagen para corregir su rotación
        ImageProcessor imageProcessor = new ImageProcessor.Builder()
                .add(new Rot90Op(-rotationDegrees / 90))
                .build();
        tensorImage = imageProcessor.process(tensorImage);

        // Ejecutamos la clasificación
        // CORRECCIÓN: El método ahora devuelve una lista de 'Classifications'
        List<Classifications> results = imageClassifier.classify(tensorImage);

        // 2. Se procesa el resultado para obtener la confianza
        // La lista 'results' contiene clasificaciones para cada "cabeza" del modelo. Para modelos de una sola cabeza, solo tendrá un elemento.
        if (results != null && !results.isEmpty() && !results.get(0).getCategories().isEmpty()) {
            // Obtenemos la lista de categorías del primer resultado de clasificación.
            List<Category> categories = results.get(0).getCategories();
            // La categoría con la puntuación más alta es nuestro resultado principal.
            Category topResult = categories.get(0);
            String fruitName = topResult.getLabel();
            float confidence = topResult.getScore();

            // Si la confianza supera un umbral, notificamos al listener
            // Este umbral evita que se notifiquen detecciones poco seguras
            if (confidence > 0.75f) {
                // 3. Se llama al listener con ambos parámetros: nombre y confianza
                listener.onFruitDetected(fruitName, confidence);
            }
        }

        // ¡Muy importante! Debemos cerrar el ImageProxy para que el siguiente fotograma pueda ser analizado.
        image.close();
    }

    /**
     * Helper para convertir un ImageProxy a un Bitmap.
     */
    private Bitmap toBitmap(ImageProxy image) {
        ImageProxy.PlaneProxy[] planes = image.getPlanes();
        java.nio.ByteBuffer yBuffer = planes[0].getBuffer();
        java.nio.ByteBuffer uBuffer = planes[1].getBuffer();
        java.nio.ByteBuffer vBuffer = planes[2].getBuffer();

        int ySize = yBuffer.remaining();
        int uSize = uBuffer.remaining();
        int vSize = vBuffer.remaining();

        byte[] nv21 = new byte[ySize + uSize + vSize];
        yBuffer.get(nv21, 0, ySize);
        vBuffer.get(nv21, ySize, vSize);
        uBuffer.get(nv21, ySize + vSize, uSize);

        android.renderscript.RenderScript rs = android.renderscript.RenderScript.create(null);
        android.renderscript.ScriptIntrinsicYuvToRGB yuvToRgb = android.renderscript.ScriptIntrinsicYuvToRGB.create(rs, android.renderscript.Element.U8_4(rs));

        android.renderscript.Type.Builder yuvType = new android.renderscript.Type.Builder(rs, android.renderscript.Element.U8(rs)).setX(nv21.length);
        android.renderscript.Allocation in = android.renderscript.Allocation.createTyped(rs, yuvType.create());

        android.renderscript.Type.Builder rgbaType = new android.renderscript.Type.Builder(rs, android.renderscript.Element.RGBA_8888(rs)).setX(image.getWidth()).setY(image.getHeight());
        android.renderscript.Allocation out = android.renderscript.Allocation.createTyped(rs, rgbaType.create());

        in.copyFrom(nv21);
        yuvToRgb.setInput(in);
        yuvToRgb.forEach(out);

        Bitmap bitmap = Bitmap.createBitmap(image.getWidth(), image.getHeight(), Bitmap.Config.ARGB_8888);
        out.copyTo(bitmap);

        return bitmap;
    }
}
