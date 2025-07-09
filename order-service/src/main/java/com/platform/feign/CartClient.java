package com.platform.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.HttpHeaders;
// import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.platform.model.CartItemDTO;

@FeignClient(name = "ecom-cart-service", configuration = com.platform.config.FeignClientInterceptorConfig.class)
public interface CartClient {

    // @GetMapping("/cart/total/{userId}")
    // double getCartTotal(@PathVariable("userId") Long userId);

    // @GetMapping("/cart/user/{userId}")
    // List<CartItemDTO> getCartItemsByUserId(@RequestParam("userId") Long userId);

    // @DeleteMapping("/cart/remove/{userId}")
    // void clearCart(@PathVariable("userId") Long userId);

    @GetMapping("/cart/total/{userId}")
    double getCartTotal(@PathVariable("userId") Long userId);

    @GetMapping("/cart/user/{userId}")
    List<CartItemDTO> getCartItemsByUserId(@PathVariable("userId") Long userId);

    @DeleteMapping("/cart/clear/{userId}")
    void clearCart(@PathVariable("userId") Long userId);
}
