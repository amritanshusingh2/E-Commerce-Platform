package com.platform.model;

import java.time.LocalDateTime;

public class DashboardStats {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private long pendingOrders;
    private long completedOrders;
    private LocalDateTime lastUpdated;
    
    public DashboardStats() {}
    
    public DashboardStats(long totalUsers, long totalProducts, long totalOrders, 
                         double totalRevenue, long pendingOrders, long completedOrders) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completedOrders;
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public long getTotalProducts() {
        return totalProducts;
    }
    
    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
    
    public long getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public double getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public long getPendingOrders() {
        return pendingOrders;
    }
    
    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }
    
    public long getCompletedOrders() {
        return completedOrders;
    }
    
    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    @Override
    public String toString() {
        return "DashboardStats{" +
                "totalUsers=" + totalUsers +
                ", totalProducts=" + totalProducts +
                ", totalOrders=" + totalOrders +
                ", totalRevenue=" + totalRevenue +
                ", pendingOrders=" + pendingOrders +
                ", completedOrders=" + completedOrders +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
} 