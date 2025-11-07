package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class FruitResponse {
    @SerializedName("fruta")
    private Fruit fruit;

    public Fruit getFruit() {
        return fruit;
    }
}