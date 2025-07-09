package com.platform.service;

import com.platform.feign.UserClient;
import com.platform.feign.ProductClient;
import com.platform.feign.OrderClient;
import com.platform.model.DashboardStats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);

    @Autowired
    private UserClient userClient;
    
    @Autowired
    private ProductClient productClient;
    
    @Autowired
    private OrderClient orderClient;

    public DashboardStats getDashboardStats() {
        logger.info("Getting dashboard stats");
        try {
            System.out.println("Fetching dashboard stats from services...");
            
            long totalUsers = userClient.getUserCount();
            logger.info("Total users: {}", totalUsers);
            
            long totalProducts = productClient.getProductCount();
            logger.info("Total products: {}", totalProducts);
            
            long totalOrders = orderClient.getOrderCount();
            logger.info("Total orders: {}", totalOrders);
            
            // Get real revenue and order status counts
            double totalRevenue = orderClient.getTotalRevenue();
            logger.info("Total revenue: {}", totalRevenue);
            
            long pendingOrders = orderClient.getPendingOrderCount();
            logger.info("Pending orders: {}", pendingOrders);
            
            long completedOrders = orderClient.getCompletedOrderCount();
            logger.info("Completed orders: {}", completedOrders);
            
            DashboardStats stats = new DashboardStats(totalUsers, totalProducts, totalOrders, 
                                    totalRevenue, pendingOrders, completedOrders);
            System.out.println("Dashboard stats created successfully: " + stats);
            logger.info("Dashboard stats created successfully: {}", stats);
            return stats;
        } catch (Exception e) {
            logger.error("Error fetching dashboard stats", e);
            System.err.println("Error fetching dashboard stats: " + e.getMessage());
            e.printStackTrace();
            // Return default stats if any service is unavailable
            return new DashboardStats(0, 0, 0, 0.0, 0, 0);
        }
    }
} 