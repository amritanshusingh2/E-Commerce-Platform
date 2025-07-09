package com.platform.controller;

import com.platform.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.platform.dto.ContactMessageRequest;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private EmailService emailService;

    @PostMapping("/order-confirmation")
    public ResponseEntity<String> sendOrderConfirmation(@RequestParam String email, 
                                                       @RequestParam String orderId, 
                                                       @RequestParam String totalAmount) {
        logger.info("POST /notifications/order-confirmation called for email: {} orderId: {}", email, orderId);
        try {
            emailService.sendOrderConfirmation(email, orderId, totalAmount);
            return ResponseEntity.ok("Order confirmation email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email for email: {} orderId: {}", email, orderId, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/order-shipped")
    public ResponseEntity<String> sendOrderShipped(@RequestParam String email, 
                                                  @RequestParam String orderId, 
                                                  @RequestParam String trackingNumber, 
                                                  @RequestParam String carrier) {
        logger.info("POST /notifications/order-shipped called for email: {} orderId: {}", email, orderId);
        try {
            emailService.sendOrderShipped(email, orderId, trackingNumber, carrier);
            return ResponseEntity.ok("Order shipped email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send order shipped email for email: {} orderId: {}", email, orderId, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/order-delivered")
    public ResponseEntity<String> sendOrderDelivered(@RequestParam String email, 
                                                    @RequestParam String orderId) {
        logger.info("POST /notifications/order-delivered called for email: {} orderId: {}", email, orderId);
        try {
            emailService.sendOrderDelivered(email, orderId);
            return ResponseEntity.ok("Order delivered email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send order delivered email for email: {} orderId: {}", email, orderId, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/payment-confirmation")
    public ResponseEntity<String> sendPaymentConfirmation(@RequestParam String email, 
                                                         @RequestParam String orderId, 
                                                         @RequestParam String amount) {
        logger.info("POST /notifications/payment-confirmation called for email: {} orderId: {}", email, orderId);
        try {
            emailService.sendPaymentConfirmation(email, orderId, amount);
            return ResponseEntity.ok("Payment confirmation email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send payment confirmation email for email: {} orderId: {}", email, orderId, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/low-stock-alert")
    public ResponseEntity<String> sendLowStockAlert(@RequestParam String email, 
                                                   @RequestParam String productName, 
                                                   @RequestParam int currentStock) {
        logger.info("POST /notifications/low-stock-alert called for email: {} product: {}", email, productName);
        try {
            emailService.sendLowStockAlert(email, productName, currentStock);
            return ResponseEntity.ok("Low stock alert email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send low stock alert email for email: {} product: {}", email, productName, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/welcome")
    public ResponseEntity<String> sendWelcomeEmail(@RequestParam String email, 
                                                  @RequestParam String username) {
        logger.info("POST /notifications/welcome called for email: {} username: {}", email, username);
        try {
            emailService.sendWelcomeEmail(email, username);
            return ResponseEntity.ok("Welcome email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send welcome email for email: {} username: {}", email, username, e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    // Test endpoint to verify email service is working
    @GetMapping("/test")
    public ResponseEntity<String> testEmailService() {
        logger.info("GET /notifications/test called");
        try {
            emailService.sendOrderConfirmation("test@example.com", "TEST-001", "99.99");
            return ResponseEntity.ok("Test email sent successfully");
        } catch (Exception e) {
            logger.error("Test email failed", e);
            return ResponseEntity.badRequest().body("Test email failed: " + e.getMessage());
        }
    }

    // Admin notification endpoints
    @PostMapping("/admin/new-order")
    public ResponseEntity<String> sendNewOrderNotificationToAdmin(@RequestParam String adminEmail,
                                                                 @RequestParam String orderId,
                                                                 @RequestParam String customerEmail,
                                                                 @RequestParam String totalAmount,
                                                                 @RequestParam String customerName) {
        logger.info("POST /notifications/admin/new-order called for orderId: {}", orderId);
        try {
            emailService.sendNewOrderNotificationToAdmin(adminEmail, orderId, customerEmail, totalAmount, customerName);
            return ResponseEntity.ok("New order notification sent to admin successfully");
        } catch (Exception e) {
            logger.error("Failed to send new order notification to admin for orderId: {}", orderId, e);
            return ResponseEntity.badRequest().body("Failed to send admin notification: " + e.getMessage());
        }
    }

    @PostMapping("/admin/order-status-update")
    public ResponseEntity<String> sendOrderStatusUpdateToAdmin(@RequestParam String adminEmail,
                                                              @RequestParam String orderId,
                                                              @RequestParam String status,
                                                              @RequestParam String customerEmail) {
        logger.info("POST /notifications/admin/order-status-update called for orderId: {} status: {}", orderId, status);
        try {
            emailService.sendOrderStatusUpdateToAdmin(adminEmail, orderId, status, customerEmail);
            return ResponseEntity.ok("Order status update sent to admin successfully");
        } catch (Exception e) {
            logger.error("Failed to send order status update to admin for orderId: {} status: {}", orderId, status, e);
            return ResponseEntity.badRequest().body("Failed to send admin notification: " + e.getMessage());
        }
    }

    @PostMapping("/password-reset")
    public ResponseEntity<String> sendPasswordResetEmail(@RequestParam String email, 
                                                        @RequestParam String resetToken,
                                                        @RequestParam String username) {
        logger.info("POST /notifications/password-reset called for email: {} username: {}", email, username);
        try {
            emailService.sendPasswordResetEmail(email, resetToken, username);
            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send password reset email for email: {} username: {}", email, username, e);
            return ResponseEntity.badRequest().body("Failed to send password reset email: " + e.getMessage());
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<String> sendContactMessage(@RequestBody ContactMessageRequest request) {
        logger.info("POST /notifications/contact called for email: {} subject: {}", request.getEmail(), request.getSubject());
        try {
            String content = "Name: " + request.getFirstName() + " " + request.getLastName() + "\n"
                         + "Email: " + request.getEmail() + "\n"
                         + "Subject: " + request.getSubject() + "\n"
                         + "Message: " + request.getMessage();
            emailService.sendSimpleMessage("myecommerce.test1@gmail.com", "Contact Form: " + request.getSubject(), content);
            return ResponseEntity.ok("Message sent to admin");
        } catch (Exception e) {
            logger.error("Failed to send contact message for email: {} subject: {}", request.getEmail(), request.getSubject(), e);
            return ResponseEntity.badRequest().body("Failed to send message: " + e.getMessage());
        }
    }
} 