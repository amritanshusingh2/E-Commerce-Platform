package com.platform.service;

import com.platform.dto.AuthRequest;
import com.platform.dto.AuthResponse;
import com.platform.dto.LoginRequest;
import com.platform.dto.UserDTO;
import com.platform.feign.NotificationClient;
import com.platform.model.Role;
import com.platform.model.User;
import com.platform.repository.UserRepository;
import com.platform.security.JavaUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.platform.dto.ChangePasswordRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaUtil jwtUtil;
    
    @Autowired
    private NotificationClient notificationClient;

    public String register(AuthRequest request) {
        logger.info("Registering user with email: {}", request.getEmail());
        try {
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already registered");
            }
            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            // Validate password strength
            if (!isPasswordStrong(request.getPassword())) {
                throw new RuntimeException("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            }
            User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName()
            );
            user.setRoles(Set.of(Role.ROLE_USER));
            userRepository.save(user);
            logger.info("User registered successfully: {}", request.getEmail());
            return "User registered successfully";
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    public AuthResponse loginAndReturnUser(String usernameOrEmail) {
        logger.info("Logging in user: {}", usernameOrEmail);
        try {
            User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            String token = jwtUtil.generateToken(user);
            AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName());
            response.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
            logger.info("Login successful for user: {}", usernameOrEmail);
            return response;
        } catch (Exception e) {
            logger.error("Login failed for user: {}", usernameOrEmail, e);
            throw e;
        }
    }

    public UserDTO getProfile(String username) {
        logger.info("Getting profile for user: {}", username);
        return getUserDTOByUsername(username);
    }

    public UserDTO updateProfile(String username, UserDTO newData) {
        logger.info("Updating profile for user: {}", username);
        try {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEmail(newData.getEmail());
            user.setFirstName(newData.getFirstName());
            user.setLastName(newData.getLastName());
            userRepository.save(user);
            
            // Return complete user data including roles
            UserDTO updatedUserDTO = new UserDTO();
            updatedUserDTO.setUsername(user.getUsername());
            updatedUserDTO.setEmail(user.getEmail());
            updatedUserDTO.setFirstName(user.getFirstName());
            updatedUserDTO.setLastName(user.getLastName());
            updatedUserDTO.setRoles(user.getRoles());
            logger.info("Profile updated for user: {}", username);
            return updatedUserDTO;
        } catch (Exception e) {
            logger.error("Profile update failed for user: {}", username, e);
            throw e;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.name()))
            .toList();
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(authorities)
            .build();
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public UserDTO getUserById(Long userId) {
        logger.info("Getting user by ID: {}", userId);
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setRoles(user.getRoles());
            logger.info("User found for ID: {}", userId);
            return userDTO;
        } catch (Exception e) {
            logger.error("Get user by ID failed for ID: {}", userId, e);
            throw e;
        }
    }

    // Forgot Password - Request Reset
    public String requestPasswordReset(String email) {
        logger.info("Requesting password reset for email: {}", email);
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            LocalDateTime expiryTime = LocalDateTime.now().plusHours(24); // Token expires in 24 hours
            
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryTime);
            userRepository.save(user);
            
            // Send password reset email
            try {
                notificationClient.sendPasswordResetEmail(email, resetToken, user.getUsername());
                logger.info("Password reset token generated for email: {}", email);
                return "Password reset email sent successfully";
            } catch (Exception e) {
                logger.error("Password reset request failed for email: {}", email, e);
                // If email fails, still return the token for testing
                return "Password reset token generated: " + resetToken + 
                       "\n\nEmail service unavailable. In production, this token would be sent to your email.";
            }
        } catch (Exception e) {
            logger.error("Password reset request failed for email: {}", email, e);
            throw e;
        }
    }

    // Forgot Password - Reset Password
    public String resetPassword(String resetToken, String newPassword) {
        logger.info("Resetting password with token: {}", resetToken);
        try {
            User user = userRepository.findByResetToken(resetToken)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));
            
            // Check if token is expired
            if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token has expired");
            }
            
            // Validate password strength
            if (!isPasswordStrong(newPassword)) {
                throw new RuntimeException("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            }
            
            // Update password and clear reset token
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            
            logger.info("Password reset successful for token: {}", resetToken);
            return "Password reset successfully";
        } catch (Exception e) {
            logger.error("Password reset failed for token: {}", resetToken, e);
            throw e;
        }
    }

    // Check if reset token is valid
    public boolean isResetTokenValid(String resetToken) {
        logger.info("Validating reset token: {}", resetToken);
        try {
            User user = userRepository.findByResetToken(resetToken)
                .orElse(null);
            
            if (user == null) {
                return false;
            }
            
            logger.info("Reset token is valid: {}", resetToken);
            return user.getResetTokenExpiry().isAfter(LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Reset token validation failed for token: {}", resetToken, e);
            return false;
        }
    }

    public String changePassword(String authHeader, ChangePasswordRequest request) {
        // Extract JWT token
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        // Use your JWT secret (replace with your actual secret or inject via @Value)
        String SECRET_KEY = "myverysecureandlongsecretkey1234567890";
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256"))
            .build()
            .parseClaimsJws(token)
            .getBody();
        String username = claims.getSubject();

        // Find user by username
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate password strength
        if (!isPasswordStrong(request.getNewPassword())) {
            throw new RuntimeException("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }

        // Set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }

    // Helper method to validate password strength
    private boolean isPasswordStrong(String password) {
        if (password == null) return false;
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*[0-9].*");
        boolean hasSpecial = password.matches(".*[^a-zA-Z0-9].*");
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    private UserDTO getUserDTOByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setRoles(user.getRoles());
        return userDTO;
    }
}