package com.fruitexplorer.fragments;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.preference.PreferenceManager;
import androidx.fragment.app.Fragment;

import com.fruitexplorer.R;
import com.fruitexplorer.activities.RegionFruitsActivity;
import com.fruitexplorer.api.ApiClient;
import com.fruitexplorer.api.ApiService;
import com.fruitexplorer.models.Region;
import com.fruitexplorer.models.RegionResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Polygon;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MapFragment extends Fragment {

    private static final String TAG = "MapFragment";
    private MapView mapView;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_map, container, false);
        Context ctx = getContext();

        Configuration.getInstance().load(ctx, PreferenceManager.getDefaultSharedPreferences(ctx));

        mapView = view.findViewById(R.id.mapView);
        mapView.setTileSource(TileSourceFactory.MAPNIK);

        IMapController mapController = mapView.getController();
        mapController.setZoom(5.5);
        GeoPoint startPoint = new GeoPoint(-9.19, -75.01); // Centro de Perú
        mapController.setCenter(startPoint);

        mapView.setMultiTouchControls(true);

        apiService = ApiClient.getApiService(getContext());
        loadRegions();

        return view;
    }

    private void loadRegions() {
        apiService.getRegions().enqueue(new Callback<RegionResponse>() {
            @Override
            public void onResponse(Call<RegionResponse> call, Response<RegionResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (final Region region : response.body().getRegions()) {
                        drawRegionPolygon(region);
                    }
                } else {
                    Toast.makeText(getContext(), "Error al cargar las regiones", Toast.LENGTH_SHORT).show();
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

        Polygon polygon = new Polygon();
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

        polygon.setPoints(geoPoints);
        polygon.getFillPaint().setColor(0x40FFC107); // Amarillo con más transparencia
        polygon.getOutlinePaint().setColor(0x80FF0000); // Rojo semitransparente
        polygon.getOutlinePaint().setStrokeWidth(5);

        polygon.setRelatedObject(region);

        polygon.setOnClickListener((p, mapView, eventPos) -> {
            Region clickedRegion = (Region) p.getRelatedObject();
            if (clickedRegion != null) {
                Intent intent = new Intent(getActivity(), RegionFruitsActivity.class);
                intent.putExtra("REGION_ID", clickedRegion.getId());
                intent.putExtra("REGION_NAME", clickedRegion.getName());
                startActivity(intent);
            }
            return true;
        });

        mapView.getOverlays().add(polygon);
        mapView.invalidate();
    }

    @Override
    public void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mapView.onPause();
    }
}