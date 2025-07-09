package com.platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Async
    public void sendOrderConfirmation(String to, String orderId, String totalAmount) {
        logger.info("Sending order confirmation email to: {} for order: {}", to, orderId);
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Order Confirmation - Order #" + orderId);
            String html = "" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background: #222; padding: 24px 0; text-align: center;'>" +
                "<img src='https://via.placeholder.com/150x60?text=GenC+Cart+Logo' alt='GenC Cart Logo' style='height: 60px; margin-bottom: 8px;' />" +
                "<h2 style='color: #fff; margin: 0;'>GenC Cart</h2>" +
                "</div>" +
                "<div style='padding: 24px;'>" +
                "<p>Thank you for your order!</p>" +
                "<p><b>Order ID:</b> " + orderId + "<br>" +
                "<b>Total Amount:</b> $" + totalAmount + "</p>" +
                "<p>We will notify you when your order ships.</p>" +
                "<p>Best regards,<br>GenC Cart Team</p>" +
                "</div>" +
                "<div style='background: #f8f8f8; color: #888; text-align: center; padding: 16px; font-size: 13px;'>" +
                "&copy; 2024 GenC Cart. All rights reserved." +
                "</div>" +
                "</div>";
            helper.setText(html, true);
            emailSender.send(message);
            logger.info("Order confirmation email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send order confirmation email to {}", to, e);
            throw new RuntimeException("Failed to send order confirmation email", e);
        }
    }

    @Async
    public void sendOrderShipped(String to, String orderId, String trackingNumber, String carrier) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Your Order Has Shipped - Order #" + orderId);
            String html = "" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background: #222; padding: 24px 0; text-align: center;'>" +
                "<img src='https://via.placeholder.com/150x60?text=GenC+Cart+Logo' alt='GenC Cart Logo' style='height: 60px; margin-bottom: 8px;' />" +
                "<h2 style='color: #fff; margin: 0;'>GenC Cart</h2>" +
                "</div>" +
                "<div style='padding: 24px;'>" +
                "<p>Great news! Your order has been shipped.</p>" +
                "<p><b>Order ID:</b> " + orderId + "<br>" +
                "<b>Tracking Number:</b> " + trackingNumber + "<br>" +
                "<b>Carrier:</b> " + carrier + "</p>" +
                "<p>You can track your package using the tracking number above.<br>If you have any questions, reply to this email.</p>" +
                "<p>Thank you for shopping with us!</p>" +
                "<p>Best regards,<br>GenC Cart Team</p>" +
                "</div>" +
                "<div style='background: #f8f8f8; color: #888; text-align: center; padding: 16px; font-size: 13px;'>" +
                "&copy; 2024 GenC Cart. All rights reserved." +
                "</div>" +
                "</div>";
            helper.setText(html, true);
            emailSender.send(message);
            System.out.println("Order shipped email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send order shipped email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send order shipped email", e);
        }
    }

    @Async
    public void sendOrderDelivered(String to, String orderId) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Order Delivered - Order #" + orderId);
            String html = "" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;'>" +
                "<div style='background: #222; padding: 24px 0; text-align: center;'>" +
                "<img src='https://via.placeholder.com/150x60?text=GenC+Cart+Logo' alt='GenC Cart Logo' style='height: 60px; margin-bottom: 8px;' />" +
                "<h2 style='color: #fff; margin: 0;'>GenC Cart</h2>" +
                "</div>" +
                "<div style='padding: 24px;'>" +
                "<p>Your order has been delivered!</p>" +
                "<p><b>Order ID:</b> " + orderId + "</p>" +
                "<p>Thank you for shopping with us. We hope you enjoy your purchase!</p>" +
                "<p>We truly appreciate your support.<br>We'd love to see you again soon. <a href='https://yourshop.com'>Order again</a></p>" +
                "<p>If you have any feedback or need help, just reply to this email.</p>" +
                "<p>Best regards,<br>GenC Cart Team</p>" +
                "</div>" +
                "<div style='background: #f8f8f8; color: #888; text-align: center; padding: 16px; font-size: 13px;'>" +
                "&copy; 2024 GenC Cart. All rights reserved." +
                "</div>" +
                "</div>";
            helper.setText(html, true);
            emailSender.send(message);
            System.out.println("Order delivered email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send order delivered email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send order delivered email", e);
        }
    }

    @Async
    public void sendPaymentConfirmation(String to, String orderId, String amount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Payment Confirmation - Order #" + orderId);
            message.setText("Your payment has been processed successfully!\n\n" +
                    "Order ID: " + orderId + "\n" +
                    "Amount Paid: $" + amount + "\n\n" +
                    "Your order is being processed and will ship soon.\n\n" +
                    "Best regards,\nE-Commerce Team");
            
            emailSender.send(message);
            System.out.println("Payment confirmation email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send payment confirmation email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send payment confirmation email", e);
        }
    }

    @Async
    public void sendLowStockAlert(String to, String productName, int currentStock) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Low Stock Alert - " + productName);
            message.setText("Low stock alert for product: " + productName + "\n\n" +
                    "Current stock: " + currentStock + " units\n\n" +
                    "Please restock this product soon.\n\n" +
                    "Best regards,\nE-Commerce Team");
            
            emailSender.send(message);
            System.out.println("Low stock alert email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send low stock alert email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send low stock alert email", e);
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to E-Commerce Platform!");
            message.setText("Welcome " + username + "!\n\n" +
                    "Thank you for registering with our e-commerce platform.\n" +
                    "We're excited to have you as a customer!\n\n" +
                    "Start shopping now and enjoy our great products.\n\n" +
                    "Best regards,\nE-Commerce Team");
            
            emailSender.send(message);
            System.out.println("Welcome email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    // Admin notification methods
    @Async
    public void sendNewOrderNotificationToAdmin(String adminEmail, String orderId, String customerEmail, String totalAmount, String customerName) {
        try {
            System.out.println("Sending new order notification to admin: " + adminEmail + " for order: " + orderId);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(adminEmail);
            message.setSubject("New Order Received - Order #" + orderId);
            message.setText("A new order has been placed!\n\n" +
                    "Order ID: " + orderId + "\n" +
                    "Customer: " + customerName + "\n" +
                    "Customer Email: " + customerEmail + "\n" +
                    "Total Amount: $" + totalAmount + "\n\n" +
                    "Please process this order as soon as possible.\n\n" +
                    "Best regards,\nE-Commerce System");
            
            emailSender.send(message);
            System.out.println("New order notification sent successfully to admin: " + adminEmail);
        } catch (Exception e) {
            System.err.println("Failed to send new order notification to admin " + adminEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send new order notification to admin", e);
        }
    }

    @Async
    public void sendOrderStatusUpdateToAdmin(String adminEmail, String orderId, String status, String customerEmail) {
        try {
            System.out.println("Sending order status update to admin: " + adminEmail + " for order: " + orderId);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(adminEmail);
            message.setSubject("Order Status Updated - Order #" + orderId);
            message.setText("Order status has been updated!\n\n" +
                    "Order ID: " + orderId + "\n" +
                    "New Status: " + status + "\n" +
                    "Customer Email: " + customerEmail + "\n\n" +
                    "Please review and take necessary action.\n\n" +
                    "Best regards,\nE-Commerce System");
            
            emailSender.send(message);
            System.out.println("Order status update sent successfully to admin: " + adminEmail);
        } catch (Exception e) {
            System.err.println("Failed to send order status update to admin " + adminEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send order status update to admin", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String resetToken, String username) {
        try {
            System.out.println("Sending password reset email to: " + to + " for user: " + username);
            
            // Create reset link (in production, this would be your frontend URL)
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset Request - E-Commerce Platform");
            message.setText("Hello " + username + ",\n\n" +
                    "You have requested to reset your password.\n\n" +
                    "Reset Token: " + resetToken + "\n" +
                    "Reset Link: " + resetLink + "\n\n" +
                    "This token will expire in 24 hours.\n\n" +
                    "If you did not request this password reset, please ignore this email.\n\n" +
                    "Best regards,\nE-Commerce Team");
            
            emailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            System.out.println("Simple message sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send simple message to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send simple message", e);
        }
    }
} 