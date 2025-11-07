package com.fruitexplorer.models;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;
import com.google.gson.JsonParser;

public class Fruit implements Parcelable {

    @SerializedName("id")
    private int id;

    @SerializedName("common_name")
    private String commonName;

    @SerializedName("scientific_name")
    private String scientificName;

    @SerializedName("description")
    private String description;

    @SerializedName("image_url")
    private String imageUrl;

    @SerializedName("nutritional") // Corregido para coincidir con la columna 'nutritional' de la BD
    private String nutritionalDataString;

    protected Fruit(Parcel in) {
        id = in.readInt();
        commonName = in.readString();
        scientificName = in.readString();
        description = in.readString();
        imageUrl = in.readString();
        nutritionalDataString = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeString(commonName);
        dest.writeString(scientificName);
        dest.writeString(description);
        dest.writeString(imageUrl);
        dest.writeString(nutritionalDataString);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Fruit> CREATOR = new Creator<Fruit>() {
        @Override
        public Fruit createFromParcel(Parcel in) {
            return new Fruit(in);
        }

        @Override
        public Fruit[] newArray(int size) {
            return new Fruit[size];
        }
    };

    // Getters
    public int getId() {
        return id;
    }

    public String getCommonName() {
        return commonName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public String getDescription() {
        return description;
    }

    public com.google.gson.JsonObject getNutritionalData() {
        if (nutritionalDataString == null || nutritionalDataString.isEmpty()) {
            return new com.google.gson.JsonObject();
        }
        return new JsonParser().parse(nutritionalDataString).getAsJsonObject();
    }

    public String getImageUrl() {
        return imageUrl;
    }
}