package com.platform.admin.admin_service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
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
                    "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtFilter(jwtSecret), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    public static class JwtFilter extends org.springframework.web.filter.OncePerRequestFilter {
        private final String jwtSecret;
        private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
        public JwtFilter(String jwtSecret) {
            this.jwtSecret = jwtSecret;
        }
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String header = request.getHeader("Authorization");
            logger.debug("[JwtFilter] Authorization header: {}", header);
            if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                try {
                    Claims claims = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                    String roles = (String) claims.get("roles");
                    logger.debug("[JwtFilter] Parsed roles from JWT: {}", roles);
                    Collection<SimpleGrantedAuthority> authorities = Arrays.stream(roles.split(","))
                        .map(role -> new SimpleGrantedAuthority(role))
                        .collect(Collectors.toList());
                    logger.debug("[JwtFilter] Authorities: {}", authorities);
                    if (roles.contains("ROLE_ADMIN")) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            claims.getSubject(), null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        logger.debug("[JwtFilter] Authentication set for subject: {} with authorities: {}", claims.getSubject(), authorities);
                    } else {
                        logger.debug("[JwtFilter] ROLE_ADMIN not found in roles: {}", roles);
                    }
                } catch (Exception e) {
                    logger.error("[JwtFilter] JWT parsing/validation error: {}", e.getMessage(), e);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                logger.debug("[JwtFilter] No Bearer token found in Authorization header.");
            }
            filterChain.doFilter(request, response);
        }
    }
} 