package com.platform.model;

public class CartSummary {
    private double totalPrice;
    private int totalItems;
    private int uniqueProducts;

    public CartSummary() {}

    public CartSummary(double totalPrice, int totalItems, int uniqueProducts) {
        this.totalPrice = totalPrice;
        this.totalItems = totalItems;
        this.uniqueProducts = uniqueProducts;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getUniqueProducts() {
        return uniqueProducts;
    }

    public void setUniqueProducts(int uniqueProducts) {
        this.uniqueProducts = uniqueProducts;
    }
} 