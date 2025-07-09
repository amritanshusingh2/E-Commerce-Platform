package com.platform.model;

import java.util.List;

public class OrderRequest {
    private String shippingAddress;
    private PaymentInfo paymentInfo;
    private List<OrderItemRequest> items;
    
    public String getShippingAddress() {
        return shippingAddress;
    }
    
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
    
    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }
    
    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
    
    public List<OrderItemRequest> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
