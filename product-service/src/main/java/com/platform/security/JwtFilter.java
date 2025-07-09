package com.platform.security;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.io.IOException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends GenericFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
    
    @Autowired
    private JavaUtil jwtUtil;
    @Lazy // Lazy initialization to avoid circular dependency issues
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String authHeader = httpRequest.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(new SecretKeySpec(jwtUtil.getSecretKey().getBytes(), SignatureAlgorithm.HS256.getJcaName()))
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody();
                
                // Try to get username from different possible claim names
                String username = claims.get("username", String.class);
                if (username == null) {
                    username = claims.getSubject(); // Fallback to subject
                }
                
                if (username != null && jwtUtil.validateToken(jwtToken)) {
                    // Use JWT claims directly instead of making database calls
                    Object rolesObj = claims.get("roles");
                    if (rolesObj != null) {
                        Collection<SimpleGrantedAuthority> authorities;
                        if (rolesObj instanceof String roles) {
                            authorities = Arrays.stream(roles.split(","))
                                .map(role -> new SimpleGrantedAuthority(role.trim()))
                                .collect(Collectors.toList());
                        } else if (rolesObj instanceof Collection<?> rolesList) {
                            authorities = rolesList.stream()
                                .map(role -> new SimpleGrantedAuthority(role.toString()))
                                .collect(Collectors.toList());
                        } else {
                            authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
                        }
                        
                        var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        logger.debug("[JwtFilter] Authentication set for user: {} with authorities: {}", username, authorities);
                    }
                } else {
                    logger.warn("[JwtFilter] Invalid token or missing username for token");
                }
            } catch (Exception e) {
                logger.error("[JwtFilter] Error processing JWT token", e);
            }
        }

        chain.doFilter(request, response);
    }
}
