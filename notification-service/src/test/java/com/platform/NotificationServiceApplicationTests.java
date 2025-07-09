package com.platform;

import com.platform.controller.NotificationController;
import com.platform.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationServiceApplicationTests {
    @Mock
    private EmailService emailService;
    @InjectMocks
    private NotificationController notificationController;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testSendOrderConfirmationSuccess() {
        doNothing().when(emailService).sendOrderConfirmation("a@b.com", "OID123", "100.00");
        ResponseEntity<String> response = notificationController.sendOrderConfirmation("a@b.com", "OID123", "100.00");
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Order confirmation email sent successfully"));
    }
    @Test
    void testSendOrderConfirmationFailure() {
        doThrow(new RuntimeException("fail")).when(emailService).sendOrderConfirmation(anyString(), anyString(), anyString());
        ResponseEntity<String> response = notificationController.sendOrderConfirmation("a@b.com", "OID123", "100.00");
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Failed to send email: fail"));
    }
    @Test
    void testSendWelcomeEmailSuccess() {
        doNothing().when(emailService).sendWelcomeEmail("a@b.com", "user1");
        ResponseEntity<String> response = notificationController.sendWelcomeEmail("a@b.com", "user1");
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Welcome email sent successfully"));
    }
    @Test
    void testTestEmailServiceSuccess() {
        doNothing().when(emailService).sendOrderConfirmation(anyString(), anyString(), anyString());
        ResponseEntity<String> response = notificationController.testEmailService();
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Test email sent successfully"));
    }
} 