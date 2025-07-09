package com.platform.admin.admin_service.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "api-gateway", configuration = com.platform.admin.admin_service.config.FeignClientInterceptorConfig.class, url = "http://localhost:8020") // Use API Gateway
public interface ProductClient {
    @GetMapping("/products")
    List<Object> getAllProducts();

    @GetMapping("/products/{id}")
    Object getProductById(@PathVariable("id") Long id);

    @PostMapping("/products")
    Object createProduct(@RequestBody Object productDTO);

    @PutMapping("/products/{id}")
    Object updateProduct(@PathVariable("id") Long id, @RequestBody Object productDTO);

    @DeleteMapping("/products/{id}")
    void deleteProduct(@PathVariable("id") Long id);

    @GetMapping("/products/admin/analytics/count")
    long getProductCount();
} 