package com.platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.platform.feign.UserClient;
import com.platform.dto.UserDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserClient userClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // Call user-service to get user details
            UserDTO userDTO = userClient.getUserByUsername(username);
            
            if (userDTO != null && userDTO.getRoles() != null) {
                // Convert roles to authorities
                List<SimpleGrantedAuthority> authorities = userDTO.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                    .collect(Collectors.toList());
                
                return User.builder()
                    .username(userDTO.getUsername())
                    .password("") // We don't need password for JWT authentication
                    .authorities(authorities)
                    .build();
            }
        } catch (Exception e) {
            // Log the error but don't throw it to avoid breaking the filter chain
            System.err.println("Error loading user details: " + e.getMessage());
        }
        
        throw new UsernameNotFoundException("User not found: " + username);
    }
} 