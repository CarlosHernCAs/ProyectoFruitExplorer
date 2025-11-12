package com.fruitexplorer.models;

public class LogQueryRequest {
    private final String fruitName;
    private final String location;
    private final Float confidence;
    private final Integer modelId;

    public LogQueryRequest(String fruitName, String location, Float confidence, Integer modelId) {
        this.fruitName = fruitName;
        this.location = location;
        this.confidence = confidence;
        this.modelId = modelId;
    }
}

