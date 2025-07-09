package com.platform.model;

public class ProductResponse {
    private Long productId;
    private String name;
    private double price;
    private String category;

    public ProductResponse(Long productId, String name, double price, String category) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    public Long getProductId() {
        return productId;
    }   
    public void setProductId(Long productId) {
        this.productId = productId; 
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public double getPrice() {
        return price;
    }   
    public void setPrice(double price) {
        this.price = price;
    }   
    public String getCategory() {
        return category;
    }   
    public void setCategory(String category) {
        this.category = category;
    }
    
}
