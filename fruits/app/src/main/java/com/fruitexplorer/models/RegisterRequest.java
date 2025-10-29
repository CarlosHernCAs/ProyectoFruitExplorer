package com.fruitexplorer.models;

import com.google.gson.annotations.SerializedName;

public class RegisterRequest {
    private String email;
    private String password;
    @SerializedName("display_name")
    private String displayName;

    public RegisterRequest(String email, String password, String displayName) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }
}