package com.platform.controller;

import com.platform.dto.AuthRequest;
import com.platform.dto.AuthResponse;
import com.platform.dto.LoginRequest;
import com.platform.dto.UserDTO;
import com.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.platform.dto.ChangePasswordRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        logger.info("POST /auth/login called for user: {}", request.getUsernameOrEmail());
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
            );
            return userService.loginAndReturnUser(request.getUsernameOrEmail());
        } catch (Exception e) {
            logger.error("Login failed for user: {}", request.getUsernameOrEmail(), e);
            throw e;
        }
    }
    
    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        logger.info("POST /auth/register called for email: {}", request.getEmail());
        try {
            return userService.register(request);
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    @GetMapping("/profile/{username}")
    public UserDTO getProfile(@PathVariable String username) {
        logger.info("GET /auth/profile/{} called", username);
        return userService.getProfile(username);
    }

    @PutMapping("/profile/{username}")
    public UserDTO updateProfile(@PathVariable String username, @RequestBody UserDTO newData) {
        logger.info("PUT /auth/profile/{} called", username);
        return userService.updateProfile(username, newData);
    }

    // Public endpoint for other services to get user by ID
    @GetMapping("/user/{userId}")
    public UserDTO getUserById(@PathVariable Long userId) {
        logger.info("GET /auth/user/{} called", userId);
        return userService.getUserById(userId);
    }

    // Forgot Password - Request Reset
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        logger.info("POST /auth/forgot-password called for email: {}", email);
        try {
            String resetToken = userService.requestPasswordReset(email);
            // In a real application, you would send this token via email
            // For now, we'll return it directly (for testing purposes)
            return "Password reset token generated: " + resetToken + 
                   "\n\nIn production, this token would be sent to your email.";
        } catch (Exception e) {
            logger.error("Forgot password failed for email: {}", email, e);
            return "Error: " + e.getMessage();
        }
    }

    // Reset Password with Token
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String resetToken, @RequestParam String newPassword) {
        logger.info("POST /auth/reset-password called with token: {}", resetToken);
        try {
            return userService.resetPassword(resetToken, newPassword);
        } catch (Exception e) {
            logger.error("Reset password failed for token: {}", resetToken, e);
            return "Error: " + e.getMessage();
        }
    }

    // Check if reset token is valid
    @GetMapping("/reset-token/validate")
    public String validateResetToken(@RequestParam String resetToken) {
        logger.info("GET /auth/reset-token/validate called with token: {}", resetToken);
        try {
            boolean isValid = userService.isResetTokenValid(resetToken);
            return isValid ? "Token is valid" : "Token is invalid or expired";
        } catch (Exception e) {
            logger.error("Validate reset token failed for token: {}", resetToken, e);
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/change-password")
    public String changePassword(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody ChangePasswordRequest request
    ) {
        logger.info("POST /auth/change-password called");
        try {
            return userService.changePassword(authHeader, request);
        } catch (Exception e) {
            logger.error("Change password failed", e);
            return "Error: " + e.getMessage();
        }
    }
}
