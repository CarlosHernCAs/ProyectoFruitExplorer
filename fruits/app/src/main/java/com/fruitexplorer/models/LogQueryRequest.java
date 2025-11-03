package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class LogQueryRequest {

    @SerializedName("fruitName")
    private String fruitName;

    @SerializedName("location")
    private String location;

    @SerializedName("usedTextToSpeech")
    private boolean usedTextToSpeech;


    public LogQueryRequest(String fruitName, String location, boolean usedTextToSpeech) {
        this.fruitName = fruitName;
        this.location = location;
        this.usedTextToSpeech = usedTextToSpeech;
    }
}