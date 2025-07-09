package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ecom-notification-service")
public interface NotificationClient {
    
    @PostMapping("/notifications/password-reset")
    String sendPasswordResetEmail(@RequestParam String email, 
                                 @RequestParam String resetToken,
                                 @RequestParam String username);
} 