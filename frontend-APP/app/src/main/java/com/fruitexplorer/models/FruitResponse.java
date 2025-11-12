package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class FruitResponse {
    // CORRECCIÓN: Cambiamos la clave para que coincida con la respuesta del backend ("fruit")
    @SerializedName("fruit")
    private Fruit fruit;

    public Fruit getFruit() {
        return fruit;
    }
}