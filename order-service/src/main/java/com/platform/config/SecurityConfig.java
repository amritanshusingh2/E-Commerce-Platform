package com.platform.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                    "/order/health"
                ).permitAll()
                .requestMatchers("/order/admin/**").hasRole("ADMIN")
                .requestMatchers("/order/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtFilter(jwtSecret), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    public static class JwtFilter extends org.springframework.web.filter.OncePerRequestFilter {
        private final String jwtSecret;
        public JwtFilter(String jwtSecret) {
            this.jwtSecret = jwtSecret;
        }
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String header = request.getHeader("Authorization");
            System.out.println("Order Service JWT Filter - Request: " + request.getMethod() + " " + request.getRequestURI());
            System.out.println("Order Service JWT Filter - Authorization header: " + header);
            
            if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                try {
                    Claims claims = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                    
                    Object rolesObj = claims.get("roles");
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
                        // Default to ROLE_USER if no roles found
                        authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
                    }
                    
                    System.out.println("Order Service JWT Filter - JWT Token roles: " + rolesObj);
                    System.out.println("Order Service JWT Filter - Authorities: " + authorities);
                    System.out.println("Order Service JWT Filter - Subject: " + claims.getSubject());
                    
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("Order Service JWT Filter - Authentication set successfully");
                } catch (Exception e) {
                    System.err.println("Order Service JWT Filter - JWT Token validation failed: " + e.getMessage());
                    e.printStackTrace();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                System.out.println("Order Service JWT Filter - No valid Authorization header found");
            }
            filterChain.doFilter(request, response);
        }
    }
} 