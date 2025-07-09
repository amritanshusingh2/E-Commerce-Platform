package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.platform.dto.UserDTO;

@FeignClient(name = "user-service", url = "http://localhost:8089")
public interface UserClient {
    @GetMapping("/admin/users/username/{username}")
    UserDTO getUserByUsername(@PathVariable("username") String username);
} 