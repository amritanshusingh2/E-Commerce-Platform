package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.platform.model.ProductDTO;

@FeignClient(name = "ecom-product-service")
public interface ProductClient {

    @GetMapping("/products/{productId}")
    ProductDTO getProductById(@PathVariable("productId") Long productId);
}
