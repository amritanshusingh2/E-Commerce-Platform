package com.platform.controller;

import com.platform.model.DashboardStats;
import com.platform.service.AnalyticsService;
import com.platform.feign.UserClient;
import com.platform.feign.ProductClient;
import com.platform.feign.OrderClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private UserClient userClient;
    
    @Autowired
    private ProductClient productClient;
    
    @Autowired
    private OrderClient orderClient;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        logger.info("GET /analytics/dashboard called");
        try {
            DashboardStats stats = analyticsService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Get dashboard stats failed", e);
            throw e;
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testServiceConnections() {
        logger.info("GET /analytics/test called");
        try {
            StringBuilder result = new StringBuilder();
            result.append("Testing service connections:\n");
            
            // Test user service
            try {
                long userCount = userClient.getUserCount();
                result.append("✓ User service: ").append(userCount).append(" users\n");
            } catch (Exception e) {
                logger.error("User service test failed", e);
                result.append("✗ User service error: ").append(e.getMessage()).append("\n");
            }
            
            // Test product service
            try {
                long productCount = productClient.getProductCount();
                result.append("✓ Product service: ").append(productCount).append(" products\n");
            } catch (Exception e) {
                logger.error("Product service test failed", e);
                result.append("✗ Product service error: ").append(e.getMessage()).append("\n");
            }
            
            // Test order service
            try {
                long orderCount = orderClient.getOrderCount();
                result.append("✓ Order service: ").append(orderCount).append(" orders\n");
            } catch (Exception e) {
                logger.error("Order service test failed", e);
                result.append("✗ Order service error: ").append(e.getMessage()).append("\n");
            }
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            logger.error("Test service connections failed", e);
            return ResponseEntity.badRequest().body("Test failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug/user")
    public ResponseEntity<String> debugUserService() {
        logger.info("GET /analytics/debug/user called");
        try {
            long userCount = userClient.getUserCount();
            return ResponseEntity.ok("User count: " + userCount);
        } catch (Exception e) {
            logger.error("Debug user service failed", e);
            return ResponseEntity.badRequest().body("User service error: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug/product")
    public ResponseEntity<String> debugProductService() {
        logger.info("GET /analytics/debug/product called");
        try {
            long productCount = productClient.getProductCount();
            return ResponseEntity.ok("Product count: " + productCount);
        } catch (Exception e) {
            logger.error("Debug product service failed", e);
            return ResponseEntity.badRequest().body("Product service error: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug/order")
    public ResponseEntity<String> debugOrderService() {
        logger.info("GET /analytics/debug/order called");
        try {
            long orderCount = orderClient.getOrderCount();
            return ResponseEntity.ok("Order count: " + orderCount);
        } catch (Exception e) {
            logger.error("Debug order service failed", e);
            return ResponseEntity.badRequest().body("Order service error: " + e.getMessage());
        }
    }
} 