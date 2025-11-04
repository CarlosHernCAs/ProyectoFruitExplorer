package com.fruitexplorer.models;

public class BaseResponse {
    private String mensaje;
    private long queryId;

    public String getMensaje() {
        return mensaje;
    }

    public long getQueryId() {
        return queryId;
    }
}