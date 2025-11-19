package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class FruitListResponse {
    @SerializedName("fruits")
    private List<Fruit> fruits;

    public List<Fruit> getFruits() {
        return fruits;
    }
}