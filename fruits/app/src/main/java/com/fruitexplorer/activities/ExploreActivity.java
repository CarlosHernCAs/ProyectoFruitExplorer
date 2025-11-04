package com.fruitexplorer.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.PreferenceManager;

import com.fruitexplorer.R;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Region;
import com.fruitexplorer.models.RegionResponse;
import com.fruitexplorer.utils.SessionManager;

import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.events.MapEventsReceiver;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.MapEventsOverlay;
import org.osmdroid.views.overlay.Polygon;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExploreActivity extends AppCompatActivity {
    private static final String TAG = "ExploreActivity";
    private SessionManager sessionManager;
    private ApiService apiService;
    private MapView mapView;
    private List<Polygon> regionPolygons = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configuración de osmdroid (muy importante)
        Context ctx = getApplicationContext();
        Configuration.getInstance().load(ctx, PreferenceManager.getDefaultSharedPreferences(ctx));

        setContentView(R.layout.activity_explore);

        sessionManager = new SessionManager(this);
        apiService = ApiClient.getApiService(this);

        TextView welcomeTextView = findViewById(R.id.welcomeText);
        Button btnStartDetection = findViewById(R.id.btnStartDetection);
        Button btnLogout = findViewById(R.id.btnLogout);

        // Personalizar el mensaje de bienvenida
        String displayName = sessionManager.getUserDisplayName();
        welcomeTextView.setText("¡Hola de nuevo, " + displayName + "!");

        btnLogout.setOnClickListener(v -> sessionManager.logoutUser());
        btnStartDetection.setOnClickListener(v -> startActivity(new Intent(this, CameraActivity.class)));

        // Configuración del MapView de osmdroid
        mapView = findViewById(R.id.mapView);
        mapView.setTileSource(TileSourceFactory.MAPNIK);
        mapView.setMultiTouchControls(true);

        IMapController mapController = mapView.getController();
        mapController.setZoom(5.5);
        GeoPoint startPoint = new GeoPoint(-9.19, -75.01); // Centro de Perú
        mapController.setCenter(startPoint);

        // Cargar las regiones desde la API
        fetchRegions();
    }

    private void fetchRegions() {
        apiService.getRegions().enqueue(new Callback<RegionResponse>() {
            @Override
            public void onResponse(Call<RegionResponse> call, Response<RegionResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (final Region region : response.body().getRegions()) {
                        drawRegionPolygon(region);
                    }
                } else {
                    Toast.makeText(ExploreActivity.this, "Error al cargar las regiones", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<RegionResponse> call, Throwable t) {
                Log.e(TAG, "Error de red al cargar regiones: ", t);
            }
        });
    }

    private void drawRegionPolygon(Region region) {
        if (region.getGeoPolygon() == null || region.getGeoPolygon().isEmpty()) {
            return;
        }

        List<GeoPoint> geoPoints = new ArrayList<>();
        try {
            JSONArray jsonArray = new JSONArray(region.getGeoPolygon());
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject point = jsonArray.getJSONObject(i);
                geoPoints.add(new GeoPoint(point.getDouble("lat"), point.getDouble("lng")));
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error al parsear el polígono para la región: " + region.getName(), e);
            return;
        }

        Polygon polygon = new Polygon();
        polygon.setPoints(geoPoints);
        polygon.getFillPaint().setColor(0x40FFC107); // Amarillo con más transparencia
        polygon.getOutlinePaint().setColor(0x80FF0000); // Rojo semitransparente
        polygon.getOutlinePaint().setStrokeWidth(5);

        // Guardamos la región en el polígono para saber a cuál se hizo clic
        polygon.setRelatedObject(region);

        // Añadimos un listener de clic para cada polígono
        polygon.setOnClickListener((p, mapView, eventPos) -> {
            Region clickedRegion = (Region) p.getRelatedObject();
            if (clickedRegion != null) {
                onRegionClick(clickedRegion);
            }
            return true; // Indica que hemos manejado el evento
        });

        mapView.getOverlays().add(polygon);
        regionPolygons.add(polygon);
        mapView.invalidate(); // Redibuja el mapa
    }

    public void onRegionClick(Region region) {
        Intent intent = new Intent(this, RegionFruitsActivity.class);
        intent.putExtra("REGION_ID", region.getId());
        intent.putExtra("REGION_NAME", region.getName());
        startActivity(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        // Necesario para el ciclo de vida de osmdroid
        mapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        // Necesario para el ciclo de vida de osmdroid
        mapView.onPause();
    }
}