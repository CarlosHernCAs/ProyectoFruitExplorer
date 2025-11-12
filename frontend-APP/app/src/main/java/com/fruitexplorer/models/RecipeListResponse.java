package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RecipeListResponse {

    @SerializedName("recetas")
    private List<Recipe> recipes;

    public List<Recipe> getRecipes() {
        return recipes;
    }
}