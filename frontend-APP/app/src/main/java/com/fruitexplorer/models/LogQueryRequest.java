package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class LogQueryRequest {
    @SerializedName("fruit_name")
    private final String fruit_name;

    @SerializedName("location")
    private final String location;

    @SerializedName("confidence")
    private final Float confidence;

    @SerializedName("model_id")
    private final Integer modelId;

    @SerializedName("device_info")
    private final String deviceInfo;

    public LogQueryRequest(String fruit_name, String location, Float confidence, Integer modelId, String deviceInfo) {
        this.fruit_name = fruit_name;
        this.location = location;
        this.confidence = confidence;
        this.modelId = modelId;
        this.deviceInfo = deviceInfo;
    }
}
