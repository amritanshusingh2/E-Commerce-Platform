package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.platform.dto.UserDTO;

@FeignClient(name = "ecom-user-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface UserClient {
    
    @GetMapping("/auth/profile/{username}")
    UserDTO getUserProfile(@PathVariable String username);
    
    @GetMapping("/auth/user/{userId}")
    UserDTO getUserById(@PathVariable Long userId);
} 