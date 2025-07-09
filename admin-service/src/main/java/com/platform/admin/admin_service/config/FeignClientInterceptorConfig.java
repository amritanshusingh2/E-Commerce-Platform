package com.platform.admin.admin_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FeignClientInterceptorConfig {

    private static final Logger logger = LoggerFactory.getLogger(FeignClientInterceptorConfig.class);

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String authorization = request.getHeader("Authorization");
                if (authorization != null) {
                    logger.debug("[FeignClientInterceptor] Forwarding Authorization header: {}", authorization);
                    requestTemplate.header("Authorization", authorization);
                } else {
                    logger.debug("[FeignClientInterceptor] No Authorization header found to forward.");
                }
            } else {
                logger.debug("[FeignClientInterceptor] No ServletRequestAttributes found.");
            }
        };
    }
}