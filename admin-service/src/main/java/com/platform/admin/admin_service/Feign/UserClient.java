package com.platform.admin.admin_service.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;
import java.util.Optional;

@FeignClient(name = "api-gateway", configuration = com.platform.admin.admin_service.config.FeignClientInterceptorConfig.class, url = "http://localhost:8020") // Use API Gateway
public interface UserClient {
    @GetMapping("/admin/users")
    List<Object> getAllUsers();

    @GetMapping("/admin/users/{id}")
    Optional<Object> getUserById(@PathVariable("id") Long id);

    @PostMapping("/admin/users")
    Object createUser(@RequestBody Object userDTO);

    @PutMapping("/admin/users/{id}")
    Object updateUser(@PathVariable("id") Long id, @RequestBody Object userDTO);

    @DeleteMapping("/admin/users/{id}")
    void deleteUser(@PathVariable("id") Long id);

    @GetMapping("/admin/users/analytics/count")
    long getUserCount();
} 