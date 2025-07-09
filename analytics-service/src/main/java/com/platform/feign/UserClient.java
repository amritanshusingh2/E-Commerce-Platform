package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ecom-user-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface UserClient {
    
    @GetMapping("/admin/users/analytics/count")
    long getUserCount();
    
    @GetMapping("/admin/users")
    Object getAllUsers();
} 