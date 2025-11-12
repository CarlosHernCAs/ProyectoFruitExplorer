package com.fruitexplorer.models;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.gson.annotations.SerializedName;

public class Recipe implements Parcelable {
    private int id;
    @SerializedName("title") // Coincide con la columna de la BD
    private String title;
    private String description;
    @SerializedName("image_url")
    private String imageUrl;
    private String source; // Campo que sí existe en la BD

    protected Recipe(Parcel in) {
        id = in.readInt();
        title = in.readString();
        description = in.readString();
        imageUrl = in.readString();
        source = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeString(title);
        dest.writeString(description);
        dest.writeString(imageUrl);
        dest.writeString(source);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Recipe> CREATOR = new Creator<Recipe>() {
        @Override
        public Recipe createFromParcel(Parcel in) {
            return new Recipe(in);
        }

        @Override
        public Recipe[] newArray(int size) {
            return new Recipe[size];
        }
    };

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getSource() {
        return source;
    }
}