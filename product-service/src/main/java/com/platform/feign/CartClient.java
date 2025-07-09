package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cart-service")
public interface CartClient {
    @DeleteMapping("/cart/remove-by-product/{productId}")
    void deleteCartItemsByProductId(@PathVariable("productId") Long productId);
} 