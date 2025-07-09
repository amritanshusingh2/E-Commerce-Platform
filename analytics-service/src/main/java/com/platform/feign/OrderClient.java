package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "ecom-order-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface OrderClient {
    
    @GetMapping("/order/admin/analytics/count")
    long getOrderCount();
    
    @GetMapping("/order/admin/orders/analytics/revenue")
    double getTotalRevenue();
    
    @GetMapping("/order/admin/orders/analytics/pending")
    long getPendingOrderCount();
    
    @GetMapping("/order/admin/orders/analytics/completed")
    long getCompletedOrderCount();
    
    @GetMapping("/order/admin/all")
    Object getAllOrders();
} 