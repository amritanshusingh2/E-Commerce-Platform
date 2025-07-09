package com.platform.admin.admin_service.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "api-gateway", configuration = com.platform.admin.admin_service.config.FeignClientInterceptorConfig.class, url = "http://localhost:8020") // Use API Gateway
public interface OrderClient {
    @GetMapping("/order/admin/all")
    List<Object> getAllOrders();

    @GetMapping("/order/admin/{orderId}")
    Object getOrderById(@PathVariable("orderId") Long orderId);

    @DeleteMapping("/order/admin/{orderId}")
    void deleteOrder(@PathVariable("orderId") Long orderId);

    @GetMapping("/order/admin/analytics/count")
    long getOrderCount();
} 