package com.platform.controller;

import com.platform.dto.UserDTO;
import com.platform.model.Role;
import com.platform.model.User;
import com.platform.repository.UserRepository;
import com.platform.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // List all users
    @GetMapping
    public List<User> getAllUsers() {
        logger.info("GET /admin/users called");
        return userRepository.findAll();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        logger.info("GET /admin/users/{} called", id);
        return userRepository.findById(id);
    }

    // Get user by username (for JWT authentication from other services)
    @GetMapping("/username/{username}")
    public UserDTO getUserByUsername(@PathVariable String username) {
        logger.info("GET /admin/users/username/{} called", username);
        try {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setRoles(user.getRoles());
            
            return userDTO;
        } catch (Exception e) {
            logger.error("Get user by username failed for: {}", username, e);
            throw e;
        }
    }

    // Create user (admin can create another admin)
    @PostMapping
    public User createUser(@RequestBody UserDTO userDTO) {
        logger.info("POST /admin/users called for username: {}", userDTO.getUsername());
        try {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setPassword(userService.encodePassword(userDTO.getPassword()));
            user.setEmail(userDTO.getEmail());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            // Set roles
            Set<Role> roles = userDTO.getRoles() != null ? userDTO.getRoles() : Set.of(Role.ROLE_USER);
            user.setRoles(roles);
            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("Create user failed for username: {}", userDTO.getUsername(), e);
            throw e;
        }
    }

    // Update user (including roles)
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        logger.info("PUT /admin/users/{} called", id);
        try {
            User user = userRepository.findById(id).orElseThrow();
            user.setEmail(userDTO.getEmail());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            if (userDTO.getRoles() != null) {
                user.setRoles(userDTO.getRoles());
            }
            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("Update user failed for id: {}", id, e);
            throw e;
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        logger.info("DELETE /admin/users/{} called", id);
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Delete user failed for id: {}", id, e);
            throw e;
        }
    }

    // Analytics: user count
    @GetMapping("/analytics/count")
    public long getUserCount() {
        logger.info("GET /admin/users/analytics/count called");
        return userRepository.count();
    }
} 