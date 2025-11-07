package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RegionResponse {

    @SerializedName("regiones") // Corregido para que coincida con el backend
    private List<Region> regions;

    public List<Region> getRegions() {
        return regions;
    }

    public void setRegions(List<Region> regions) {
        this.regions = regions;
    }
}