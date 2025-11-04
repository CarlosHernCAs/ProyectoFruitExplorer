package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class FruitResponse {
    @SerializedName("fruta")
    private Fruit fruit;

    // Añadimos este campo para manejar listas de frutas
    @SerializedName("frutas")
    private List<Fruit> fruits;

    public Fruit getFruit() {
        return fruit;
    }

    // Y su getter correspondiente
    public List<Fruit> getFruits() { return fruits; }
}