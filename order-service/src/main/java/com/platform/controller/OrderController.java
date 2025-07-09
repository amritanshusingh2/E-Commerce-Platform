package com.platform.controller;
import org.springframework.web.bind.annotation.*;
import com.platform.entity.Order;
import com.platform.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import com.platform.model.OrderRequest;
import com.platform.model.OrderResponse;
import java.util.List;
import org.springframework.http.HttpHeaders;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Value;
import com.platform.feign.NotificationClient;
import com.platform.feign.UserClient;
import com.platform.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/order")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private UserClient userClient;

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private Long extractUserIdFromToken(String token) {
        logger.debug("Extracting userId from token: {}", token);
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            logger.debug("JWT claims: {}, subject: {}", claims, claims.getSubject());
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            logger.error("Error extracting userId from token", e);
            throw e;
        }
    }

    @GetMapping("/user")
    public List<Order> getOrdersByUserId(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("GET /order/user called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return orderService.getOrdersByUserId(userId);
        } catch (Exception e) {
            logger.error("Get orders by user ID failed", e);
            throw e;
        }
    }
    
    @GetMapping("/user/details")
    public List<OrderResponse> getUserOrderDetails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("GET /order/user/details called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return orderService.getUserOrderDetails(userId);
        } catch (Exception e) {
            logger.error("Get user order details failed", e);
            throw e;
        }
    }

    @PostMapping("/create")
    public OrderResponse createOrder(@RequestBody OrderRequest request, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        logger.info("POST /order/create called");
        try {
            Long userId = extractUserIdFromToken(authHeader);
            return orderService.placeOrder(request, userId);
        } catch (Exception e) {
            logger.error("Create order failed", e);
            throw e;
        }
    }

    @PutMapping("/status/{orderId}")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        logger.info("PUT /order/status/{} called with status: {}", orderId, status);
        try {
            return orderService.updateOrderStatus(orderId, status);
        } catch (Exception e) {
            logger.error("Update order status failed for order ID: {} with status: {}", orderId, status, e);
            throw e;
        }
    }

    @PutMapping("/payment/{orderId}")
    public Order updatePaymentStatus(@PathVariable Long orderId, @RequestParam String status) {
        logger.info("PUT /order/payment/{} called with status: {}", orderId, status);
        try {
            return orderService.updatePaymentStatus(orderId, status);
        } catch (Exception e) {
            logger.error("Update payment status failed for order ID: {} with status: {}", orderId, status, e);
            throw e;
        }
    }
    
    @PutMapping("/tracking/{orderId}")
    public Order updateOrderTracking(@PathVariable Long orderId, 
                                   @RequestParam String trackingNumber, 
                                   @RequestParam String carrier) {
        logger.info("PUT /order/tracking/{} called with tracking: {} carrier: {}", orderId, trackingNumber, carrier);
        try {
            return orderService.updateOrderTracking(orderId, trackingNumber, carrier);
        } catch (Exception e) {
            logger.error("Update order tracking failed for order ID: {}", orderId, e);
            throw e;
        }
    }
    
    @PutMapping("/delivered/{orderId}")
    public Order markOrderAsDelivered(@PathVariable Long orderId) {
        logger.info("PUT /order/delivered/{} called", orderId);
        try {
            return orderService.markOrderAsDelivered(orderId);
        } catch (Exception e) {
            logger.error("Mark order as delivered failed for order ID: {}", orderId, e);
            throw e;
        }
    }

    // ADMIN: List all orders
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        logger.info("GET /order/admin/all called");
        return orderService.getAllOrders();
    }

    // ADMIN: Get order by ID
    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Order getOrderById(@PathVariable Long orderId) {
        logger.info("GET /order/admin/{} called", orderId);
        try {
            return orderService.getOrderById(orderId);
        } catch (Exception e) {
            logger.error("Get order by ID failed for order ID: {}", orderId, e);
            throw e;
        }
    }

    // ADMIN: Delete order
    @DeleteMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(@PathVariable Long orderId) {
        logger.info("DELETE /order/admin/{} called", orderId);
        try {
            orderService.deleteOrder(orderId);
        } catch (Exception e) {
            logger.error("Delete order failed for order ID: {}", orderId, e);
            throw e;
        }
    }

    // ADMIN: Analytics - order count
    @GetMapping("/admin/analytics/count")
    @PreAuthorize("hasRole('ADMIN')")
    public long getOrderCount() {
        logger.info("GET /order/admin/analytics/count called");
        return orderService.getOrderCount();
    }
    
    // ADMIN: Analytics - total revenue
    @GetMapping("/admin/orders/analytics/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public double getTotalRevenue() {
        logger.info("GET /order/admin/orders/analytics/revenue called");
        return orderService.getTotalRevenue();
    }
    
    // ADMIN: Analytics - pending orders count
    @GetMapping("/admin/orders/analytics/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public long getPendingOrderCount() {
        logger.info("GET /order/admin/orders/analytics/pending called");
        return orderService.getPendingOrderCount();
    }
    
    // ADMIN: Analytics - completed orders count
    @GetMapping("/admin/orders/analytics/completed")
    @PreAuthorize("hasRole('ADMIN')")
    public long getCompletedOrderCount() {
        logger.info("GET /order/admin/orders/analytics/completed called");
        return orderService.getCompletedOrderCount();
    }
    
    // ADMIN: Get all orders (for analytics)
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrdersForAnalytics() {
        logger.info("GET /order/admin/orders called");
        return orderService.getAllOrders();
    }

    // Test endpoint to verify notification service
    @PostMapping("/test-email")
    public String testEmail(@RequestParam String email) {
        logger.info("POST /order/test-email called for email: {}", email);
        try {
            String response = notificationClient.sendOrderConfirmation(email, "TEST-001", "99.99");
            return "Test email sent successfully: " + response;
        } catch (Exception e) {
            logger.error("Test email failed for email: {}", email, e);
            return "Test email failed: " + e.getMessage();
        }
    }

    // Test endpoint to verify user service
    @GetMapping("/test-user/{userId}")
    public String testUserService(@PathVariable Long userId) {
        logger.info("GET /order/test-user/{} called", userId);
        try {
            UserDTO userDTO = userClient.getUserById(userId);
            if (userDTO != null && userDTO.getEmail() != null) {
                return "User service working. User: " + userDTO.getUsername() + ", Email: " + userDTO.getEmail();
            } else {
                return "User service working but email is null. User: " + userDTO;
            }
        } catch (Exception e) {
            logger.error("User service test failed for user ID: {}", userId, e);
            return "User service failed: " + e.getMessage();
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public String healthCheck() {
        logger.info("GET /order/health called");
        return "Order service is running!";
    }

    // Comprehensive debugging endpoint for email notifications
    @PostMapping("/debug-email/{userId}")
    public String debugEmailNotifications(@PathVariable Long userId, @RequestParam String orderId, @RequestParam String totalAmount) {
        StringBuilder result = new StringBuilder();
        result.append("=== Email Notification Debug Report ===\n\n");
        
        try {
            // Step 1: Test User Service Communication
            result.append("Step 1: Testing User Service Communication\n");
            result.append("----------------------------------------\n");
            try {
                System.out.println("Debug: Attempting to get user email for userId: " + userId);
                UserDTO userDTO = userClient.getUserById(userId);
                System.out.println("Debug: UserDTO received: " + userDTO);
                
                if (userDTO != null) {
                    result.append("✅ User Service Communication: SUCCESS\n");
                    result.append("   User ID: " + userId + "\n");
                    result.append("   Username: " + userDTO.getUsername() + "\n");
                    result.append("   Email: " + (userDTO.getEmail() != null ? userDTO.getEmail() : "NULL") + "\n");
                    result.append("   First Name: " + userDTO.getFirstName() + "\n");
                    result.append("   Last Name: " + userDTO.getLastName() + "\n");
                    
                    if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
                        result.append("❌ ISSUE: User email is null or empty!\n");
                        result.append("   This is why user is not receiving emails.\n");
                        result.append("   Please check if user has a valid email in database.\n\n");
                    } else {
                        result.append("✅ User email is valid: " + userDTO.getEmail() + "\n\n");
                    }
                } else {
                    result.append("❌ User Service Communication: FAILED\n");
                    result.append("   UserDTO is null\n\n");
                }
            } catch (Exception e) {
                result.append("❌ User Service Communication: FAILED\n");
                result.append("   Error: " + e.getMessage() + "\n");
                result.append("   This means Order Service cannot reach User Service.\n");
                result.append("   Possible causes:\n");
                result.append("   1. User Service is not running on port 8089\n");
                result.append("   2. JWT token forwarding is not working\n");
                result.append("   3. Network connectivity issues\n\n");
                e.printStackTrace();
            }
            
            // Step 2: Test Notification Service Communication
            result.append("Step 2: Testing Notification Service Communication\n");
            result.append("------------------------------------------------\n");
            try {
                String testResponse = notificationClient.sendOrderConfirmation("debug@test.com", "DEBUG-001", "99.99");
                result.append("✅ Notification Service Communication: SUCCESS\n");
                result.append("   Response: " + testResponse + "\n\n");
            } catch (Exception e) {
                result.append("❌ Notification Service Communication: FAILED\n");
                result.append("   Error: " + e.getMessage() + "\n");
                result.append("   This means Order Service cannot reach Notification Service.\n");
                result.append("   Possible causes:\n");
                result.append("   1. Notification Service is not running on port 8091\n");
                result.append("   2. Network connectivity issues\n\n");
                e.printStackTrace();
            }
            
            // Step 3: Test Actual User Email Sending
            result.append("Step 3: Testing Actual User Email Sending\n");
            result.append("----------------------------------------\n");
            try {
                UserDTO userDTO = userClient.getUserById(userId);
                if (userDTO != null && userDTO.getEmail() != null && !userDTO.getEmail().trim().isEmpty()) {
                    String emailResponse = notificationClient.sendOrderConfirmation(
                        userDTO.getEmail(), 
                        orderId, 
                        totalAmount
                    );
                    result.append("✅ User Email Sending: SUCCESS\n");
                    result.append("   Email sent to: " + userDTO.getEmail() + "\n");
                    result.append("   Response: " + emailResponse + "\n");
                    result.append("   Please check your email inbox and spam folder.\n\n");
                } else {
                    result.append("❌ User Email Sending: SKIPPED\n");
                    result.append("   Cannot send email because user email is null or empty.\n\n");
                }
            } catch (Exception e) {
                result.append("❌ User Email Sending: FAILED\n");
                result.append("   Error: " + e.getMessage() + "\n\n");
                e.printStackTrace();
            }
            
            // Step 4: Test Admin Email Sending
            result.append("Step 4: Testing Admin Email Sending\n");
            result.append("----------------------------------\n");
            try {
                UserDTO userDTO = userClient.getUserById(userId);
                String userEmail = (userDTO != null && userDTO.getEmail() != null) ? userDTO.getEmail() : "unknown@email.com";
                String customerName = (userDTO != null) ? userDTO.getFirstName() + " " + userDTO.getLastName() : "Unknown Customer";
                
                String adminResponse = notificationClient.sendNewOrderNotificationToAdmin(
                    "admin@ecommerce.com",
                    orderId,
                    userEmail,
                    totalAmount,
                    customerName
                );
                result.append("✅ Admin Email Sending: SUCCESS\n");
                result.append("   Admin email sent to: admin@ecommerce.com\n");
                result.append("   Response: " + adminResponse + "\n\n");
            } catch (Exception e) {
                result.append("❌ Admin Email Sending: FAILED\n");
                result.append("   Error: " + e.getMessage() + "\n\n");
                e.printStackTrace();
            }
            
            // Step 5: Summary and Recommendations
            result.append("Step 5: Summary and Recommendations\n");
            result.append("-----------------------------------\n");
            result.append("Based on the tests above:\n\n");
            
            UserDTO userDTO = null;
            try {
                userDTO = userClient.getUserById(userId);
            } catch (Exception e) {
                // Ignore error here as we already tested it above
            }
            
            if (userDTO == null) {
                result.append("🔴 CRITICAL ISSUE: Cannot reach User Service\n");
                result.append("   Action: Restart User Service and Order Service\n\n");
            } else if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
                result.append("🔴 CRITICAL ISSUE: User has no email address\n");
                result.append("   Action: Update user email in database or re-register user\n\n");
            } else {
                result.append("🟢 All services are working correctly\n");
                result.append("   User should receive emails. Check spam folder.\n\n");
            }
            
        } catch (Exception e) {
            result.append("❌ Debug process failed: " + e.getMessage() + "\n");
            e.printStackTrace();
        }
        
        return result.toString();
    }
}
