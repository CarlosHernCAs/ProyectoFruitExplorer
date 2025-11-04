package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class RegionResponse {
    @SerializedName("regiones")
    private List<Region> regions;

    public List<Region> getRegions() {
        return regions;
    }
}