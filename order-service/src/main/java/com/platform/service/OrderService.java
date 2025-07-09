package com.platform.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.platform.repository.OrderRepository;
import com.platform.feign.CartClient;
import com.platform.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.platform.model.OrderRequest;
import com.platform.model.ProductDTO;
import com.platform.feign.ProductClient;
import com.platform.feign.NotificationClient;
import com.platform.feign.UserClient;
import com.platform.model.CartItemDTO;
import com.platform.model.OrderResponse;
import com.platform.model.OrderItem;
import com.platform.model.PaymentInfo;
import com.platform.model.OrderItemRequest;
import com.platform.service.PaymentService.PaymentResult;
import com.platform.dto.UserDTO;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import org.springframework.scheduling.annotation.Async;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartClient cartClient;

    @Autowired
    private ProductClient productClient;
    
    @Autowired
    private NotificationClient notificationClient;
    
    @Autowired
    private UserClient userClient;
    
    @Autowired
    private PaymentService paymentService;
    
    @Value("${admin.email:admin@ecommerce.com}")
    private String adminEmail;

    public List<Order> getOrdersByUserId(Long userId) {
        logger.info("Getting orders by user ID: {}", userId);
        return orderRepository.findByUserId(userId);
    }
    
    public List<OrderResponse> getUserOrderDetails(Long userId) {
        logger.info("Getting user order details for user ID: {}", userId);
        try {
            List<Order> orders = orderRepository.findByUserId(userId);
            List<OrderResponse> orderResponses = new ArrayList<>();
            
            for (Order order : orders) {
                OrderResponse response = new OrderResponse();
                response.setOrderId(order.getOrderId());
                response.setUserId(order.getUserId());
                response.setTotalPrice(order.getTotalPrice());
                response.setOrderStatus(order.getOrderStatus());
                response.setPaymentStatus(order.getPaymentStatus());
                response.setShippingAddress(order.getShippingAddress());
                response.setTrackingNumber(order.getTrackingNumber());
                response.setCarrier(order.getCarrier());
                response.setEstimatedDelivery(order.getEstimatedDelivery());
                response.setShippedAt(order.getShippedAt());
                response.setDeliveredAt(order.getDeliveredAt());
                response.setPaymentMethod(order.getPaymentMethod());
                response.setTransactionId(order.getTransactionId());
                response.setPaymentProcessedAt(order.getPaymentProcessedAt());
                response.setCreatedAt(order.getCreatedAt());
                
                // Map order items to DTOs
                java.util.List<com.platform.model.OrderItem> orderItemDTOs = new java.util.ArrayList<>();
                for (com.platform.entity.OrderItem item : order.getOrderItems()) {
                    com.platform.model.OrderItem dto = new com.platform.model.OrderItem();
                    dto.setProductId(item.getProductId());
                    dto.setProductName(item.getProductName());
                    dto.setPrice(item.getPrice());
                    dto.setQuantity(item.getQuantity());
                    dto.setTotalPrice(item.getTotalPrice());
                    orderItemDTOs.add(dto);
                }
                response.setOrderItems(orderItemDTOs);
                
                orderResponses.add(response);
            }
            
            return orderResponses;
        } catch (Exception e) {
            logger.error("Get user order details failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public Order createOrder(OrderRequest request, Long userId) {
        logger.info("Creating order for user ID: {}", userId);
        try {
            double totalPrice = cartClient.getCartTotal(userId);
            Order order = new Order();
            order.setUserId(userId);
            order.setShippingAddress(request.getShippingAddress());
            order.setTotalPrice(totalPrice);
            order.setOrderStatus("PENDING");
            order.setPaymentStatus("PENDING");
            order.setCreatedAt(LocalDateTime.now());
            
            // Set default values for tracking and delivery
            order.setTrackingNumber("TBD"); // To be determined
            order.setCarrier("TBD"); // To be determined
            order.setEstimatedDelivery(LocalDateTime.now().plusDays(7)); // Default 7 days delivery
            order.setShippedAt(null); // Will be set when shipped
            order.setDeliveredAt(null); // Will be set when delivered
            
            logger.info("Order created successfully for user ID: {}", userId);
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Create order failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public Order updateOrderStatus(Long orderId, String status) {
        logger.info("Updating order status for order ID: {} to status: {}", orderId, status);
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setOrderStatus(status);
            if ("SHIPPED".equalsIgnoreCase(status)) {
                order.setShippedAt(LocalDateTime.now());
                order.setEstimatedDelivery(LocalDateTime.now().plusDays(5));
                // Send order shipped email synchronously
                try {
                    String userEmail = order.getUserEmail();
                    if (userEmail == null || userEmail.trim().isEmpty()) {
                        userEmail = "customer@example.com";
                        try {
                            UserDTO userDTO = userClient.getUserById(order.getUserId());
                            if (userDTO != null && userDTO.getEmail() != null) {
                                userEmail = userDTO.getEmail();
                            }
                        } catch (Exception e) {
                            System.err.println("Failed to get user email for order " + orderId + ": " + e.getMessage());
                        }
                    }
                    notificationClient.sendOrderShipped(userEmail, String.valueOf(orderId), order.getTrackingNumber(), order.getCarrier());
                    notificationClient.sendOrderStatusUpdateToAdmin(adminEmail, String.valueOf(orderId), "SHIPPED", userEmail);
                } catch (Exception e) {
                    System.err.println("Failed to send order shipped email: " + e.getMessage());
                }
            } else if ("DELIVERED".equalsIgnoreCase(status)) {
                order.setDeliveredAt(LocalDateTime.now());
                // Send order delivered email synchronously
                try {
                    String userEmail = order.getUserEmail();
                    if (userEmail == null || userEmail.trim().isEmpty()) {
                        userEmail = "customer@example.com";
                        try {
                            UserDTO userDTO = userClient.getUserById(order.getUserId());
                            if (userDTO != null && userDTO.getEmail() != null) {
                                userEmail = userDTO.getEmail();
                            }
                        } catch (Exception e) {
                            System.err.println("Failed to get user email for order " + orderId + ": " + e.getMessage());
                        }
                    }
                    notificationClient.sendOrderDelivered(userEmail, String.valueOf(orderId));
                    notificationClient.sendOrderStatusUpdateToAdmin(adminEmail, String.valueOf(orderId), "DELIVERED", userEmail);
                } catch (Exception e) {
                    System.err.println("Failed to send order delivered email: " + e.getMessage());
                }
            }
            logger.info("Order status updated successfully for order ID: {} to status: {}", orderId, status);
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Update order status failed for order ID: {} to status: {}", orderId, status, e);
            throw e;
        }
    }

    public Order updatePaymentStatus(Long orderId, String status) {
        logger.info("Updating payment status for order ID: {} to status: {}", orderId, status);
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setPaymentStatus(status);
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Update payment status failed for order ID: {} to status: {}", orderId, status, e);
            throw e;
        }
    }
    
    public Order updateOrderTracking(Long orderId, String trackingNumber, String carrier) {
        logger.info("Updating order tracking for order ID: {} with tracking: {} carrier: {}", orderId, trackingNumber, carrier);
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setTrackingNumber(trackingNumber);
            order.setCarrier(carrier);
            // Do NOT set status to SHIPPED or send emails here
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Update order tracking failed for order ID: {}", orderId, e);
            throw e;
        }
    }
    
    public Order markOrderAsDelivered(Long orderId) {
        logger.info("Marking order as delivered for order ID: {}", orderId);
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setOrderStatus("DELIVERED");
            order.setDeliveredAt(LocalDateTime.now());
            // Send order delivered email synchronously
            try {
                String userEmail = order.getUserEmail(); // Try stored email first
                if (userEmail == null || userEmail.trim().isEmpty()) {
                    userEmail = "customer@example.com"; // Default fallback
                    try {
                        UserDTO userDTO = userClient.getUserById(order.getUserId());
                        if (userDTO != null && userDTO.getEmail() != null) {
                            userEmail = userDTO.getEmail();
                        }
                    } catch (Exception e) {
                        System.err.println("Failed to get user email for order " + orderId + ": " + e.getMessage());
                    }
                }
                notificationClient.sendOrderDelivered(userEmail, String.valueOf(orderId));
                notificationClient.sendOrderStatusUpdateToAdmin(adminEmail, String.valueOf(orderId), "DELIVERED", userEmail);
            } catch (Exception e) {
                System.err.println("Failed to send order delivered email: " + e.getMessage());
            }
            logger.info("Order marked as delivered successfully for order ID: {}", orderId);
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Mark order as delivered failed for order ID: {}", orderId, e);
            throw e;
        }
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request, Long userId) {
        long startTime = System.currentTimeMillis();
        System.out.println("Processing order for user: " + userId);
        System.out.println("Order request: " + request);
        
        // Validate payment info
        if (request.getPaymentInfo() == null) {
            throw new RuntimeException("Payment information is required");
        }
        
        // Calculate total price from cart or items
        double totalPrice = 0.0;
        List<CartItemDTO> cartItems = new ArrayList<>();
        
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            // Use items from request
            for (OrderItemRequest itemRequest : request.getItems()) {
                ProductDTO product = productClient.getProductById(itemRequest.getProductId());
                if (product == null || product.getStockQuantity() < itemRequest.getQuantity()) {
                    throw new RuntimeException("Product " + (product != null ? product.getName() : itemRequest.getProductId()) + " is out of stock or unavailable.");
                }
                totalPrice += product.getPrice() * itemRequest.getQuantity();
                // Convert to CartItemDTO for consistency
                CartItemDTO cartItem = new CartItemDTO();
                cartItem.setProductId(itemRequest.getProductId());
                cartItem.setQuantity(itemRequest.getQuantity());
                cartItems.add(cartItem);
            }
        } else {
            // Use cart items
            cartItems = cartClient.getCartItemsByUserId(userId);
            System.out.println("Cart items: " + cartItems);
            for (CartItemDTO item : cartItems) {
                ProductDTO product = productClient.getProductById(item.getProductId());
                if (product == null || product.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Product " + (product != null ? product.getName() : item.getProductId()) + " is out of stock or unavailable.");
                }
                totalPrice += product.getPrice() * item.getQuantity();
            }
        }

        // Process payment with optimized retry logic
        PaymentResult paymentResult = null;
        int maxRetries = 2; // Reduced from 3 to 2
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            paymentResult = paymentService.processPayment(request.getPaymentInfo(), totalPrice);
            
            if (paymentResult.isSuccess()) {
                System.out.println("Payment successful for user " + userId + " on attempt " + attempt + ": " + paymentResult.getMessage());
                break;
            } else {
                System.err.println("Payment attempt " + attempt + " failed for user " + userId + ": " + paymentResult.getMessage());
                if (attempt == maxRetries) {
                    throw new RuntimeException("Payment failed after " + maxRetries + " attempts: " + paymentResult.getMessage());
                }
                // Reduced wait time from 1000ms to 200ms
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Payment retry interrupted");
                }
            }
        }

        // Try to get user information before creating order
        String userEmail = null;
        String customerName = "Customer";
        try {
            UserDTO userDTO = userClient.getUserById(userId);
            if (userDTO != null && userDTO.getEmail() != null && !userDTO.getEmail().trim().isEmpty()) {
                userEmail = userDTO.getEmail();
                customerName = (userDTO.getFirstName() != null ? userDTO.getFirstName() : "") + 
                             " " + (userDTO.getLastName() != null ? userDTO.getLastName() : "").trim();
                if (customerName.trim().isEmpty()) {
                    customerName = "Customer";
                }
                System.out.println("Retrieved user info for order: " + userEmail + " - " + customerName);
            }
        } catch (Exception e) {
            System.err.println("Could not retrieve user info during order creation: " + e.getMessage());
            // Continue with order creation even if user service is down
        }
        
        // Create the order
        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(request.getShippingAddress());
        order.setTotalPrice(totalPrice);
        order.setOrderStatus("PENDING");
        order.setPaymentStatus(paymentResult.getPaymentStatus());
        order.setPaymentMethod(request.getPaymentInfo().getPaymentMethod().name());
        order.setTransactionId(paymentResult.getTransactionId());
        order.setPaymentProcessedAt(paymentResult.getProcessedAt());
        order.setUserEmail(userEmail); // Store user email in order
        order.setCustomerName(customerName); // Store customer name in order
        order.setCreatedAt(LocalDateTime.now());
        
        // Set default values for tracking and delivery
        order.setTrackingNumber("TBD"); // To be determined
        order.setCarrier("TBD"); // To be determined
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(7)); // Default 7 days delivery
        order.setShippedAt(null); // Will be set when shipped
        order.setDeliveredAt(null); // Will be set when delivered
        
        // Create order items
        List<com.platform.entity.OrderItem> orderItems = new ArrayList<>();
        for (CartItemDTO item : cartItems) {
            ProductDTO product = productClient.getProductById(item.getProductId());
            com.platform.entity.OrderItem orderItem = new com.platform.entity.OrderItem();
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setProductName(product.getName());
            orderItem.setTotalPrice(product.getPrice() * item.getQuantity());
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Update stock for all products in the order (optimized)
        try {
            // Batch stock updates to reduce HTTP calls
            for (CartItemDTO item : cartItems) {
                productClient.updateStockForOrder(item.getProductId(), item.getQuantity());
                System.out.println("Updated stock for product " + item.getProductId() + " by " + item.getQuantity());
            }
        } catch (Exception e) {
            // Log error but don't fail the order - stock can be updated later
            System.err.println("Stock update failed, but order will proceed: " + e.getMessage());
        }

        // Clear the cart after successful order placement (non-blocking)
        new Thread(() -> {
            try {
                cartClient.clearCart(userId);
                System.out.println("Cart cleared successfully for user: " + userId);
            } catch (Exception e) {
                System.err.println("Failed to clear cart for user " + userId + ": " + e.getMessage());
                // Don't fail the order if cart clearing fails
            }
        }).start();

        // Send order confirmation email synchronously
        sendOrderConfirmationEmailSync(savedOrder, userId);

        // Prepare the order response
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(savedOrder.getOrderId());
        orderResponse.setUserId(savedOrder.getUserId());
        orderResponse.setTotalPrice(savedOrder.getTotalPrice());
        orderResponse.setOrderStatus(savedOrder.getOrderStatus());
        orderResponse.setPaymentStatus(savedOrder.getPaymentStatus());
        orderResponse.setShippingAddress(savedOrder.getShippingAddress());
        orderResponse.setTrackingNumber(savedOrder.getTrackingNumber());
        orderResponse.setCarrier(savedOrder.getCarrier());
        orderResponse.setEstimatedDelivery(savedOrder.getEstimatedDelivery());
        orderResponse.setShippedAt(savedOrder.getShippedAt());
        orderResponse.setDeliveredAt(savedOrder.getDeliveredAt());
        orderResponse.setPaymentMethod(savedOrder.getPaymentMethod());
        orderResponse.setTransactionId(savedOrder.getTransactionId());
        orderResponse.setPaymentProcessedAt(savedOrder.getPaymentProcessedAt());
        orderResponse.setCreatedAt(savedOrder.getCreatedAt());
        
        // Map order items to DTOs
        java.util.List<com.platform.model.OrderItem> orderItemDTOs = new java.util.ArrayList<>();
        for (com.platform.entity.OrderItem item : savedOrder.getOrderItems()) {
            com.platform.model.OrderItem dto = new com.platform.model.OrderItem();
            dto.setProductId(item.getProductId());
            dto.setProductName(item.getProductName());
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setTotalPrice(item.getTotalPrice());
            orderItemDTOs.add(dto);
        }
        orderResponse.setOrderItems(orderItemDTOs);

        long endTime = System.currentTimeMillis();
        System.out.println("Order processing completed in: " + (endTime - startTime) + "ms");

        return orderResponse;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public long getOrderCount() {
        return orderRepository.count();
    }
    
    public double getTotalRevenue() {
        return orderRepository.findAll().stream()
                .filter(order -> {
                    String status = order.getOrderStatus();
                    return "COMPLETED".equalsIgnoreCase(status) || "DELIVERED".equalsIgnoreCase(status);
                })
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }
    
    public long getPendingOrderCount() {
        return orderRepository.findAll().stream()
                .filter(order -> "PENDING".equals(order.getOrderStatus()))
                .count();
    }
    
    public long getCompletedOrderCount() {
        return orderRepository.findAll().stream()
                .filter(order -> {
                    String status = order.getOrderStatus();
                    return "COMPLETED".equalsIgnoreCase(status) || "DELIVERED".equalsIgnoreCase(status);
                })
                .count();
    }
    
    // Replace async with sync email sending
    private void sendOrderConfirmationEmailSync(Order savedOrder, Long userId) {
        try {
            // First, try to use the email stored in the order (fallback)
            String userEmail = savedOrder.getUserEmail();
            String customerName = savedOrder.getCustomerName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                // If no email stored in order, try to get from user service with retry mechanism
                int maxRetries = 3;
                for (int attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        System.out.println("Attempt " + attempt + ": Attempting to get user email for userId: " + userId);
                        UserDTO userDTO = userClient.getUserById(userId);
                        System.out.println("UserDTO received: " + userDTO);
                        if (userDTO != null && userDTO.getEmail() != null && !userDTO.getEmail().trim().isEmpty()) {
                            userEmail = userDTO.getEmail();
                            customerName = (userDTO.getFirstName() != null ? userDTO.getFirstName() : "") +
                                         " " + (userDTO.getLastName() != null ? userDTO.getLastName() : "").trim();
                            if (customerName.trim().isEmpty()) {
                                customerName = "Customer";
                            }
                            System.out.println("Successfully retrieved user email: " + userEmail + " for customer: " + customerName);
                            break; // Success, exit retry loop
                        } else {
                            System.err.println("UserDTO is null or email is null/empty for userId: " + userId);
                            System.err.println("UserDTO: " + userDTO);
                            if (attempt == maxRetries) {
                                System.err.println("Max retries reached. User email not available.");
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Attempt " + attempt + " failed to get user email for userId " + userId + ": " + e.getMessage());
                        if (attempt == maxRetries) {
                            System.err.println("Max retries reached. User service might be down.");
                            e.printStackTrace();
                        } else {
                            // Wait before retry
                            try {
                                Thread.sleep(1000 * attempt); // Exponential backoff
                            } catch (InterruptedException ie) {
                                Thread.currentThread().interrupt();
                                break;
                            }
                        }
                    }
                }
            } else {
                System.out.println("Using stored email from order: " + userEmail + " for customer: " + customerName);
            }
            // Send email to user if we have a valid user email
            if (userEmail != null && !userEmail.trim().isEmpty()) {
                try {
                    System.out.println("Attempting to send order confirmation email to: " + userEmail);
                    String emailResponse = notificationClient.sendOrderConfirmation(userEmail,
                                                           String.valueOf(savedOrder.getOrderId()),
                                                           String.valueOf(savedOrder.getTotalPrice()));
                    System.out.println("Order confirmation email sent successfully to: " + userEmail + ". Response: " + emailResponse);
                } catch (Exception e) {
                    System.err.println("Failed to send order confirmation email to user: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.err.println("Cannot send email - no valid user email found for userId: " + userId);
                System.err.println("Please check if user service is running and user has valid email");
                System.err.println("User service should be running on port 8089 with name 'ecom-user-service'");
            }
            // Send admin notification (to a default admin email)
            try {
                System.out.println("Attempting to send new order notification to admin: " + adminEmail);
                String adminResponse = notificationClient.sendNewOrderNotificationToAdmin(
                    adminEmail,
                    String.valueOf(savedOrder.getOrderId()),
                    userEmail != null ? userEmail : "unknown@email.com",
                    String.valueOf(savedOrder.getTotalPrice()),
                    customerName
                );
                System.out.println("Admin notification sent successfully. Response: " + adminResponse);
            } catch (Exception e) {
                System.err.println("Failed to send admin notification: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
