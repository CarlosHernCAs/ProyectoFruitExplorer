package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RecipeListResponse {
    
    // Corregimos la clave para que coincida con la respuesta del backend ("recipes")
    @SerializedName("recipes")
    private List<Recipe> recipes;

    public List<Recipe> getRecipes() {
        return recipes;
    }
}