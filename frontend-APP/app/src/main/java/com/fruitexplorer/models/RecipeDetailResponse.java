package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class RecipeDetailResponse {

    @SerializedName("recipe")
    private Recipe recipe;

    @SerializedName("steps")
    private List<RecipeStep> steps;

    public Recipe getRecipe() {
        return recipe;
    }

    public List<RecipeStep> getSteps() {
        return steps;
    }
}