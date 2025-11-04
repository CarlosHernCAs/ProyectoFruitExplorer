package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class User {
    private String id;
    private String email;
    @SerializedName("display_name")
    private String displayName;

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }
}