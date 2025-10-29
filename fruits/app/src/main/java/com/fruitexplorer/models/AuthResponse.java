package com.fruitexplorer.models;

public class AuthResponse {
    private String mensaje;
    private String token;
    private User usuario;

    public String getMensaje() {
        return mensaje;
    }

    public String getToken() {
        return token;
    }

    public User getUsuario() {
        return usuario;
    }
}