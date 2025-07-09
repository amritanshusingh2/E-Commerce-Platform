package com.platform.admin.admin_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.platform.admin.admin_service.Feign.UserClient;
import com.platform.admin.admin_service.Feign.ProductClient;
import com.platform.admin.admin_service.Feign.OrderClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    @Autowired
    private UserClient userClient;
    @Autowired
    private ProductClient productClient;
    @Autowired
    private OrderClient orderClient;

    // User management
    @GetMapping("/users")
    public List<Object> getAllUsers() {
        logger.info("GET /admin/users called");
        return userClient.getAllUsers();
    }
    @GetMapping("/users/{id}")
    public Object getUserById(@PathVariable Long id) {
        logger.info("GET /admin/users/{} called", id);
        return userClient.getUserById(id);
    }
    @PostMapping("/users")
    public Object createUser(@RequestBody Object userDTO) {
        logger.info("POST /admin/users called");
        return userClient.createUser(userDTO);
    }
    @PutMapping("/users/{id}")
    public Object updateUser(@PathVariable Long id, @RequestBody Object userDTO) {
        logger.info("PUT /admin/users/{} called", id);
        return userClient.updateUser(id, userDTO);
    }
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        logger.info("DELETE /admin/users/{} called", id);
        userClient.deleteUser(id);
    }
    @GetMapping("/users/analytics/count")
    public long getUserCount() {
        logger.info("GET /admin/users/analytics/count called");
        return userClient.getUserCount();
    }

    // Product management
    @GetMapping("/products")
    public List<Object> getAllProducts() {
        logger.info("GET /admin/products called");
        return productClient.getAllProducts();
    }
    @GetMapping("/products/{id}")
    public Object getProductById(@PathVariable Long id) {
        logger.info("GET /admin/products/{} called", id);
        return productClient.getProductById(id);
    }
    @PostMapping("/products")
    public Object createProduct(@RequestBody Object productDTO) {
        logger.info("POST /admin/products called");
        return productClient.createProduct(productDTO);
    }
    @PutMapping("/products/{id}")
    public Object updateProduct(@PathVariable Long id, @RequestBody Object productDTO) {
        logger.info("PUT /admin/products/{} called", id);
        return productClient.updateProduct(id, productDTO);
    }
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        logger.info("DELETE /admin/products/{} called", id);
        productClient.deleteProduct(id);
    }
    @GetMapping("/products/analytics/count")
    public long getProductCount() {
        logger.info("GET /admin/products/analytics/count called");
        return productClient.getProductCount();
    }

    // Order management
    @GetMapping("/orders")
    public List<Object> getAllOrders() {
        logger.info("GET /admin/orders called");
        return orderClient.getAllOrders();
    }
    @GetMapping("/orders/{orderId}")
    public Object getOrderById(@PathVariable Long orderId) {
        logger.info("GET /admin/orders/{} called", orderId);
        return orderClient.getOrderById(orderId);
    }
    @DeleteMapping("/orders/{orderId}")
    public void deleteOrder(@PathVariable Long orderId) {
        logger.info("DELETE /admin/orders/{} called", orderId);
        orderClient.deleteOrder(orderId);
    }
    @GetMapping("/orders/analytics/count")
    public long getOrderCount() {
        logger.info("GET /admin/orders/analytics/count called");
        return orderClient.getOrderCount();
    }
} 