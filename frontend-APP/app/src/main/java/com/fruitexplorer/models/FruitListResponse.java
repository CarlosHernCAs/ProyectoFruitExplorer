package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class FruitListResponse {
    // Corregimos la clave para que coincida con la respuesta estandarizada del backend
    @SerializedName("fruits")
    private List<Fruit> fruits;

    public List<Fruit> getFruits() {
        return fruits;
    }
}