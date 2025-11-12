package com.fruitexplorer.models;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Fruit implements Parcelable {

    @SerializedName("id")
    private int id;

    @SerializedName("common_name")
    private String commonName;

    @SerializedName("slug")
    private String slug;

    @SerializedName("scientific_name")
    private String scientificName;

    @SerializedName("description")
    private String description;

    @SerializedName("image_url")
    private String imageUrl;

    @SerializedName("nutritional")
    private JsonObject nutritional;

    protected Fruit(Parcel in) {
        id = in.readInt();
        commonName = in.readString();
        slug = in.readString();
        scientificName = in.readString();
        description = in.readString();
        imageUrl = in.readString();
        String nutritionalString = in.readString();
        nutritional = (nutritionalString != null) ? new JsonParser().parse(nutritionalString).getAsJsonObject() : null;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeString(commonName);
        dest.writeString(slug);
        dest.writeString(scientificName);
        dest.writeString(description);
        dest.writeString(imageUrl);
        dest.writeString(nutritional != null ? nutritional.toString() : null);
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

    public String getSlug() {
        return slug;
    }

    public String getScientificName() {
        return scientificName;
    }

    public String getDescription() {
        return description;
    }

    public com.google.gson.JsonObject getNutritionalData() {
        if (nutritional == null) {
            return new com.google.gson.JsonObject();
        }
        return nutritional; // Esto ya es un JsonObject, no necesita parseo
    }

    public String getImageUrl() {
        return imageUrl;
    }
}