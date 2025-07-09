package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ecom-notification-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface NotificationClient {
    
    @PostMapping("/notifications/order-confirmation")
    String sendOrderConfirmation(@RequestParam String email, 
                                @RequestParam String orderId, 
                                @RequestParam String totalAmount);
    
    @PostMapping("/notifications/order-shipped")
    String sendOrderShipped(@RequestParam String email, 
                           @RequestParam String orderId, 
                           @RequestParam String trackingNumber, 
                           @RequestParam String carrier);
    
    @PostMapping("/notifications/order-delivered")
    String sendOrderDelivered(@RequestParam String email, 
                             @RequestParam String orderId);
    
    // Admin notification methods
    @PostMapping("/notifications/admin/new-order")
    String sendNewOrderNotificationToAdmin(@RequestParam String adminEmail,
                                          @RequestParam String orderId,
                                          @RequestParam String customerEmail,
                                          @RequestParam String totalAmount,
                                          @RequestParam String customerName);
    
    @PostMapping("/notifications/admin/order-status-update")
    String sendOrderStatusUpdateToAdmin(@RequestParam String adminEmail,
                                       @RequestParam String orderId,
                                       @RequestParam String status,
                                       @RequestParam String customerEmail);
} 