package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class RecipeStep {

    @SerializedName("step_number")
    private int stepNumber;

    @SerializedName("description")
    private String description;

    public int getStepNumber() {
        return stepNumber;
    }

    public String getDescription() {
        return description;
    }
}