package com.platform.service;

import com.platform.model.PaymentInfo;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PaymentService {
    
    public PaymentResult processPayment(PaymentInfo paymentInfo, double amount) {
        PaymentResult result = new PaymentResult();
        
        try {
            switch (paymentInfo.getPaymentMethod()) {
                case COD:
                    return processCODPayment(amount);
                case UPI:
                    return processUPIPayment(paymentInfo, amount);
                case CARD:
                    return processCardPayment(paymentInfo, amount);
                case NET_BANKING:
                    return processNetBankingPayment(paymentInfo, amount);
                default:
                    result.setSuccess(false);
                    result.setMessage("Invalid payment method");
                    return result;
            }
        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage("Payment processing failed: " + e.getMessage());
            return result;
        }
    }
    
    private PaymentResult processCODPayment(double amount) {
        PaymentResult result = new PaymentResult();
        result.setSuccess(true);
        result.setPaymentStatus("PENDING");
        result.setTransactionId("COD-" + generateTransactionId());
        result.setMessage("Cash on Delivery - Payment will be collected upon delivery");
        result.setProcessedAt(LocalDateTime.now());
        return result;
    }
    
    private PaymentResult processUPIPayment(PaymentInfo paymentInfo, double amount) {
        PaymentResult result = new PaymentResult();
        
        // Validate UPI ID
        if (paymentInfo.getUpiId() == null || paymentInfo.getUpiId().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("UPI ID is required");
            return result;
        }
        
        // Simulate UPI payment processing
        if (simulatePaymentSuccess()) {
            result.setSuccess(true);
            result.setPaymentStatus("PAID");
            result.setTransactionId("UPI-" + generateTransactionId());
            result.setMessage("UPI payment successful");
            result.setProcessedAt(LocalDateTime.now());
        } else {
            result.setSuccess(false);
            result.setMessage("UPI payment failed - Please try again");
        }
        
        return result;
    }
    
    private PaymentResult processCardPayment(PaymentInfo paymentInfo, double amount) {
        PaymentResult result = new PaymentResult();
        
        // Validate card details
        if (paymentInfo.getCardNumber() == null || paymentInfo.getCardNumber().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("Card number is required");
            return result;
        }
        
        if (paymentInfo.getCardHolderName() == null || paymentInfo.getCardHolderName().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("Card holder name is required");
            return result;
        }
        
        if (paymentInfo.getExpiryDate() == null || paymentInfo.getExpiryDate().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("Card expiry date is required");
            return result;
        }
        
        if (paymentInfo.getCvv() == null || paymentInfo.getCvv().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("CVV is required");
            return result;
        }
        
        // Simulate card payment processing
        if (simulatePaymentSuccess()) {
            result.setSuccess(true);
            result.setPaymentStatus("PAID");
            result.setTransactionId("CARD-" + generateTransactionId());
            result.setMessage("Card payment successful");
            result.setProcessedAt(LocalDateTime.now());
        } else {
            result.setSuccess(false);
            result.setMessage("Card payment failed - Please check your card details");
        }
        
        return result;
    }
    
    private PaymentResult processNetBankingPayment(PaymentInfo paymentInfo, double amount) {
        PaymentResult result = new PaymentResult();
        
        // Validate bank details
        if (paymentInfo.getBankName() == null || paymentInfo.getBankName().trim().isEmpty()) {
            result.setSuccess(false);
            result.setMessage("Bank name is required");
            return result;
        }
        
        // Simulate net banking payment processing
        if (simulatePaymentSuccess()) {
            result.setSuccess(true);
            result.setPaymentStatus("PAID");
            result.setTransactionId("NET-" + generateTransactionId());
            result.setMessage("Net banking payment successful");
            result.setProcessedAt(LocalDateTime.now());
        } else {
            result.setSuccess(false);
            result.setMessage("Net banking payment failed - Please try again");
        }
        
        return result;
    }
    
    private String generateTransactionId() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase() + 
               LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
    
    private boolean simulatePaymentSuccess() {
        // Simulate 95% success rate for demo purposes (more reliable)
        return Math.random() > 0.05;
    }
    
    public static class PaymentResult {
        private boolean success;
        private String paymentStatus;
        private String transactionId;
        private String message;
        private LocalDateTime processedAt;
        
        public PaymentResult() {}
        
        // Getters and Setters
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getPaymentStatus() {
            return paymentStatus;
        }
        
        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }
        
        public String getTransactionId() {
            return transactionId;
        }
        
        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public LocalDateTime getProcessedAt() {
            return processedAt;
        }
        
        public void setProcessedAt(LocalDateTime processedAt) {
            this.processedAt = processedAt;
        }
    }
} 