package com.platform.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.platform.service.CartService;
import com.platform.entity.CartItem;
import com.platform.model.CartItemRequest;
import org.springframework.http.HttpHeaders;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import com.platform.model.CartItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/cart")

public class CartController {

    @Autowired
    private CartService cartService;    

    private static final String SECRET_KEY = "myverysecureandlongsecretkey1234567890";
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    protected Long extractUserIdFromToken(String token) {
        logger.debug("Extracting userId from token");
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            logger.error("Error extracting userId from token", e);
            throw e;
        }
    }

    @GetMapping("/user")
    public List<CartItemDTO> getCartItemsByUserId(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("GET /cart/user called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return cartService.getCartItemsByUserId(userId);
        } catch (Exception e) {
            logger.error("Get cart items by user ID failed", e);
            throw e;
        }
    }
    @PostMapping("/add")
    public CartItem addCartItem(@RequestBody CartItemRequest request, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("POST /cart/add called for product ID: {}", request.getProductId());
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return cartService.addCartItem(request, userId);
        } catch (Exception e) {
            logger.error("Add cart item failed for product ID: {}", request.getProductId(), e);
            throw e;
        }
    }
    @DeleteMapping("/remove/{cartItemId}")
    public void removeCartItem(@PathVariable Long cartItemId) {
        logger.info("DELETE /cart/remove/{} called", cartItemId);
        try {
            cartService.removeCartItem(cartItemId);
        } catch (Exception e) {
            logger.error("Remove cart item failed for cart item ID: {}", cartItemId, e);
            throw e;
        }
    }
    @GetMapping("/total")
    public double calculateTotalPrice(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("GET /cart/total called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return cartService.calculateTotalPrice(userId);
        } catch (Exception e) {
            logger.error("Calculate total price failed", e);
            throw e;
        }
    }
    @DeleteMapping("/clear")
    public void clearCart(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("DELETE /cart/clear called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            cartService.clearCart(userId);
        } catch (Exception e) {
            logger.error("Clear cart failed", e);
            throw e;
        }
    }

    @GetMapping("/user/{userId}")
    public List<CartItemDTO> getCartItemsByUserIdFeign(@PathVariable Long userId) {
        logger.info("GET /cart/user/{} called (Feign)", userId);
        return cartService.getCartItemsByUserId(userId);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCartFeign(@PathVariable Long userId) {
        logger.info("DELETE /cart/clear/{} called (Feign)", userId);
        try {
            cartService.clearCart(userId);
        } catch (Exception e) {
            logger.error("Clear cart failed for user ID: {} (Feign)", userId, e);
            throw e;
        }
    }

    @GetMapping("/total/{userId}")
    public double calculateTotalPriceFeign(@PathVariable Long userId) {
        logger.info("GET /cart/total/{} called (Feign)", userId);
        return cartService.calculateTotalPrice(userId);
    }

    @GetMapping("/summary")
    public com.platform.model.CartSummary getCartSummary(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("GET /cart/summary called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return cartService.getCartSummary(userId);
        } catch (Exception e) {
            logger.error("Get cart summary failed", e);
            throw e;
        }
    }

    @PutMapping("/update/{cartItemId}")
    public CartItem updateCartItemQuantity(@PathVariable Long cartItemId, @RequestParam int quantity) {
        logger.info("PUT /cart/update/{} called with quantity: {}", cartItemId, quantity);
        try {
            return cartService.updateCartItemQuantity(cartItemId, quantity);
        } catch (Exception e) {
            logger.error("Update cart item quantity failed for cart item ID: {} with quantity: {}", cartItemId, quantity, e);
            throw e;
        }
    }

    @DeleteMapping("/remove-by-product/{productId}")
    public void removeCartItemsByProductId(@PathVariable Long productId) {
        logger.info("DELETE /cart/remove-by-product/{} called", productId);
        try {
            cartService.removeCartItemsByProductId(productId);
        } catch (Exception e) {
            logger.error("Remove cart items by product ID failed for product ID: {}", productId, e);
            throw e;
        }
    }
}

