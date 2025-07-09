package com.platform.model;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class OrderResponse {
    private Long orderId;
    private Long userId;
    private double totalPrice;
    private String shippingAddress;
    private String orderStatus;
    private String paymentStatus;
    private String trackingNumber;
    private String carrier;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime estimatedDelivery;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime shippedAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deliveredAt;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime paymentProcessedAt;
    private List<OrderItem> orderItems;
    private String message;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public OrderResponse() {}

    public OrderResponse(Long orderId, Long userId, double totalPrice, String shippingAddress, 
                        String orderStatus, String paymentStatus, String trackingNumber, 
                        String carrier, LocalDateTime estimatedDelivery, LocalDateTime shippedAt, 
                        LocalDateTime deliveredAt, String paymentMethod, String transactionId,
                        LocalDateTime paymentProcessedAt, List<OrderItem> orderItems, String message) {
        this.orderId = orderId;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.shippingAddress = shippingAddress;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.trackingNumber = trackingNumber;
        this.carrier = carrier;
        this.estimatedDelivery = estimatedDelivery;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentProcessedAt = paymentProcessedAt;
        this.orderItems = orderItems;
        this.message = message;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    
    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public LocalDateTime getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public LocalDateTime getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(LocalDateTime shippedAt) {
        this.shippedAt = shippedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getPaymentProcessedAt() {
        return paymentProcessedAt;
    }

    public void setPaymentProcessedAt(LocalDateTime paymentProcessedAt) {
        this.paymentProcessedAt = paymentProcessedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 