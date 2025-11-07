package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class FruitListResponse {

    @SerializedName("frutas") // Clave correcta que coincide con el backend
    private List<Fruit> fruits;

    public List<Fruit> getFruits() {
        return fruits;
    }
}