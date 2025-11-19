package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class FruitResponse {
    @SerializedName("fruit")
    private Fruit fruit;

    public Fruit getFruit() {
        return fruit;
    }
}