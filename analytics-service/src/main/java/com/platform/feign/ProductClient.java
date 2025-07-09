package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "ecom-product-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface ProductClient {
    
    @GetMapping("/products/admin/analytics/count")
    long getProductCount();
    
    @GetMapping("/products")
    Object getAllProducts();
} 